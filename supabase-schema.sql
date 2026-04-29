-- Run this in your Supabase SQL Editor to set up the database

create table posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null default 'Short Story',
  excerpt text,
  body text not null,
  thumb int default 0,
  created_at timestamptz default now()
);

-- Allow public read access (anyone can read your blog)
alter table posts enable row level security;

create policy "Public can read posts"
  on posts for select
  using (true);

create policy "Anyone can insert posts"
  on posts for insert
  with check (true);

create policy "Anyone can delete posts"
  on posts for delete
  using (true);

-- Optional: seed with a sample post
insert into posts (title, category, excerpt, body, thumb) values (
  'The Last Letter in the Lighthouse',
  'Short Story',
  'She had climbed these stairs a hundred times, but tonight the lantern room held something it never had before…',
  'She had climbed these stairs a hundred times, but tonight the lantern room held something it never had before — a folded sheet of paper, salt-stained and trembling in the draft from the cracked pane.

The handwriting was her grandmother''s. She recognised the way the letters leaned to the left, as though every word was bracing against a wind only they could feel.

"If you find this," it began, "then the sea has let you in."

She sat on the cold iron floor and read until the lamp above her began to turn, painting the room gold, then dark, then gold again.',
  0
);
