export interface IColumn {
  id: string;
  name: string;
  tasks: ITask[];
}

export interface ITask {
  id: string;
  title: string;
  description?: string;
  subtasks: ISubtask[];
}

export interface ISubtask {
  id: string;
  title: string;
  isCompleted: boolean;
}
