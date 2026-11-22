import { NextRequest, NextResponse } from "next/server";
import { db, pool } from "@/db";
import { questionProgress, studySessions } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

let tablesEnsured = false;

async function ensureTables() {
  if (tablesEnsured) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS question_progress (
      question_id INTEGER PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'unseen',
      wrong_count INTEGER NOT NULL DEFAULT 0,
      correct_count INTEGER NOT NULL DEFAULT 0,
      bookmarked BOOLEAN NOT NULL DEFAULT FALSE,
      personal_note TEXT DEFAULT '',
      last_attempt_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS study_sessions (
      id SERIAL PRIMARY KEY,
      mode TEXT NOT NULL,
      topic_filter TEXT NOT NULL DEFAULT 'all',
      total_questions INTEGER NOT NULL,
      correct_count INTEGER NOT NULL,
      score REAL NOT NULL,
      max_score REAL NOT NULL,
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      shuffled BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      details JSONB
    );
  `);
  tablesEnsured = true;
}

export async function GET() {
  try {
    await ensureTables();
    const progressList = await db.select().from(questionProgress);
    const sessionsList = await db
      .select()
      .from(studySessions)
      .orderBy(desc(studySessions.createdAt))
      .limit(25);

    return NextResponse.json({
      progress: progressList,
      sessions: sessionsList,
    });
  } catch (error) {
    console.error("GET /api/progress error:", error);
    return NextResponse.json(
      { progress: [], sessions: [], error: "Failed to load progress" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTables();
    const body = await req.json();

    if (body.action === "reset_all") {
      await pool.query(`DELETE FROM question_progress; DELETE FROM study_sessions;`);
      return NextResponse.json({ ok: true });
    }

    if (body.action === "clear_wrong") {
      await pool.query(
        `UPDATE question_progress SET status = 'mastered' WHERE status = 'wrong';`
      );
      return NextResponse.json({ ok: true });
    }

    if (body.action === "update_question") {
      const {
        questionId,
        status,
        wrongCount,
        correctCount,
        bookmarked,
        personalNote,
      } = body;

      const existing = await db
        .select()
        .from(questionProgress)
        .where(eq(questionProgress.questionId, Number(questionId)));

      if (existing.length === 0) {
        await db.insert(questionProgress).values({
          questionId: Number(questionId),
          status: status ?? "unseen",
          wrongCount: wrongCount ?? 0,
          correctCount: correctCount ?? 0,
          bookmarked: bookmarked ?? false,
          personalNote: personalNote ?? "",
          lastAttemptAt: new Date(),
        });
      } else {
        const current = existing[0];
        await db
          .update(questionProgress)
          .set({
            status: status !== undefined ? status : current.status,
            wrongCount: wrongCount !== undefined ? wrongCount : current.wrongCount,
            correctCount:
              correctCount !== undefined ? correctCount : current.correctCount,
            bookmarked: bookmarked !== undefined ? bookmarked : current.bookmarked,
            personalNote:
              personalNote !== undefined ? personalNote : current.personalNote,
            lastAttemptAt: new Date(),
          })
          .where(eq(questionProgress.questionId, Number(questionId)));
      }

      return NextResponse.json({ ok: true });
    }

    if (body.action === "save_session") {
      const {
        mode,
        topicFilter,
        totalQuestions,
        correctCount,
        score,
        maxScore,
        durationSeconds,
        shuffled,
        details,
      } = body;

      const [inserted] = await db
        .insert(studySessions)
        .values({
          mode: mode || "all",
          topicFilter: topicFilter || "all",
          totalQuestions: Number(totalQuestions) || 0,
          correctCount: Number(correctCount) || 0,
          score: Number(score) || 0,
          maxScore: Number(maxScore) || 10,
          durationSeconds: Number(durationSeconds) || 0,
          shuffled: Boolean(shuffled),
          details: details || null,
        })
        .returning();

      return NextResponse.json({ ok: true, session: inserted });
    }

    return NextResponse.json({ ok: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/progress error:", error);
    return NextResponse.json(
      { ok: false, error: "Database operation failed" },
      { status: 500 }
    );
  }
}
