drop table public.item_modules;

CREATE TABLE public.item_modules (
                                     module_id serial NOT NULL,
                                     item_id serial NOT NULL,
                                     title varchar(200) NOT NULL,
                                     completed bool NULL DEFAULT false,
                                     CONSTRAINT item_modules_pkey PRIMARY KEY (item_id, module_id)
);