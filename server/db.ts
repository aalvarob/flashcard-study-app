import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL);
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Flashcard operations
import { flashcards, InsertFlashcard, Flashcard } from "../drizzle/schema";

export async function getAllFlashcards() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get flashcards: database not available");
    return [];
  }

  return db.select().from(flashcards);
}

export async function createFlashcard(data: InsertFlashcard) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(flashcards).values(data);
  return (result as any).insertId || 0;
}

export async function updateFlashcard(id: number, data: Partial<InsertFlashcard>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(flashcards).set(data).where(eq(flashcards.id, id));
}

export async function deleteFlashcard(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(flashcards).where(eq(flashcards.id, id));
}

export async function getFlashcardById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get flashcard: database not available");
    return undefined;
  }

  const result = await db.select().from(flashcards).where(eq(flashcards.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Flashcard Progress operations
import { flashcardProgress, InsertFlashcardProgress, FlashcardProgress } from "../drizzle/schema";
import { studySessions, InsertStudySession, StudySession } from "../drizzle/schema";
import { and } from "drizzle-orm";

export async function upsertFlashcardProgress(data: InsertFlashcardProgress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(flashcardProgress)
    .where(
      and(
        eq(flashcardProgress.userId, data.userId!),
        eq(flashcardProgress.flashcardId, data.flashcardId!)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Update existing record
    await db
      .update(flashcardProgress)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(flashcardProgress.userId, data.userId!),
          eq(flashcardProgress.flashcardId, data.flashcardId!)
        )
      );
  } else {
    // Insert new record
    await db.insert(flashcardProgress).values(data);
  }
}

export async function getUserFlashcardProgress(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get progress: database not available");
    return [];
  }

  return db.select().from(flashcardProgress).where(eq(flashcardProgress.userId, userId));
}

export async function getFlashcardProgressByArea(userId: number, area: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get progress: database not available");
    return [];
  }

  return db
    .select()
    .from(flashcardProgress)
    .where(and(eq(flashcardProgress.userId, userId), eq(flashcardProgress.area, area)));
}

// Study Sessions operations
export async function createStudySession(data: InsertStudySession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(studySessions).values(data);
  return (result as any).insertId || 0;
}

export async function updateStudySession(id: number, data: Partial<InsertStudySession>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(studySessions).set(data).where(eq(studySessions.id, id));
}

export async function getUserStudySessions(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get sessions: database not available");
    return [];
  }

  return db.select().from(studySessions).where(eq(studySessions.userId, userId));
}

export async function getStudySessionById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get session: database not available");
    return undefined;
  }

  const result = await db.select().from(studySessions).where(eq(studySessions.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserStatsByArea(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get stats: database not available");
    return [];
  }

  return db
    .select({
      area: flashcardProgress.area,
      correctCount: flashcardProgress.correctCount,
      wrongCount: flashcardProgress.wrongCount,
      notSureCount: flashcardProgress.notSureCount,
      notRememberCount: flashcardProgress.notRememberCount,
    })
    .from(flashcardProgress)
    .where(eq(flashcardProgress.userId, userId));
}

// TODO: add feature queries here as your schema grows.


// Mapeamento de IDs de áreas (snake_case) para nomes reais (Title Case)
const areaMapping: Record<string, string> = {
  'escrituras_sagradas': 'Escrituras Sagradas',
  'deus_pai': 'Deus Pai',
  'deus_filho': 'Deus Filho',
  'deus_espirito_santo': 'Deus Espírito Santo',
  'homem': 'Homem',
  'pecado': 'Pecado',
  'salvacao': 'Salvação',
  'eleicao': 'Eleição',
  'reino_de_deus': 'Reino de Deus',
  'igreja': 'Igreja',
  'dia_do_senhor': 'Dia do Senhor',
  'ministerio_da_palavra': 'Ministério da Palavra',
  'liberdade_religiosa': 'Liberdade Religiosa',
  'morte': 'Morte',
  'justos_e_impios': 'Justos e Ímpios',
  'anjos': 'Anjos',
  'amor_ao_proximo_e_etica': 'Amor ao Próximo e Ética',
  'batismo_e_ceia': 'Batismo e Ceia',
  'mordomia': 'Mordomia',
  'evangelismo_e_missoes': 'Evangelismo e Missões',
  'educacao_religiosa': 'Educação Religiosa',
  'ordem_social': 'Ordem Social',
  'familia': 'Família',
  'principios_batistas': 'Princípios Batistas',
  'historia_dos_batistas': 'História dos Batistas',
  'estrutura_e_funcionamento_cbb': 'Estrutura e Funcionamento CBB',
};

export async function fixAreaMapping() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  let updated = 0;
  const allFlashcards = await db.select().from(flashcards);
  
  for (const card of allFlashcards) {
    const correctArea = areaMapping[card.area];
    if (correctArea && correctArea !== card.area) {
      await db.update(flashcards).set({ area: correctArea }).where(eq(flashcards.id, card.id));
      updated++;
    }
  }
  
  return { updated, total: allFlashcards.length };
}
