export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
  user_id: string;
}

export interface TodoFormData {
  text: string;
}