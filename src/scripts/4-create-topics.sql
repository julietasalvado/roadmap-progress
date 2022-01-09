CREATE TABLE public.topics (
                               id serial NOT NULL,
                               title varchar(200) NOT NULL,
                               CONSTRAINT topics_pkey PRIMARY KEY (id)
);

CREATE TABLE public.item_topics (
                                    item_id serial NOT NULL,
                                    topic_id serial NOT NULL,
                                    CONSTRAINT item_topics_pkey PRIMARY KEY (item_id, topic_id)
);