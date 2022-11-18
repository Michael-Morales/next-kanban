import { Prisma } from "@prisma/client";

export interface IBoard {
  id: string;
  name: string;
}

export interface IColumn {
  id: string;
  name: string;
  boardId: string;
}
// export type ColumnType = Readonly<Prisma.Column>

export interface ITask {
  id: string;
  title: string;
  description: string | null;
  columnId: string;
}

export interface ISubtask {
  id: string;
  title: string;
  isCompleted: boolean;
  taskId: string;
}
