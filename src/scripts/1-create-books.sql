CREATE TABLE public.books (
id serial NOT NULL,
title varchar(200) NOT NULL,
starred bool NULL DEFAULT false,
cover_url varchar(300) NOT NULL,
CONSTRAINT books_pkey PRIMARY KEY (id)
);