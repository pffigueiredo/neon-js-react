-- Create todos table
CREATE TABLE public.todos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id text NOT NULL,
    title text NOT NULL,
    completed boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own todos" ON public.todos FOR
SELECT USING (auth.user_id () = user_id);

CREATE POLICY "Users can create their own todos" ON public.todos FOR
INSERT
WITH
    CHECK (auth.user_id () = user_id);

CREATE POLICY "Users can update their own todos" ON public.todos FOR
UPDATE USING (auth.user_id () = user_id);

CREATE POLICY "Users can delete their own todos" ON public.todos FOR DELETE USING (auth.user_id () = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_todos_updated_at
  BEFORE UPDATE ON public.todos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();