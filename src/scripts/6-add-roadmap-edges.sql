CREATE TABLE public.roadmap_edges (
                                      edge_id varchar(200) NOT NULL,
                                      roadmap_id serial NOT NULL,
                                      edge_from varchar(200) not NULL,
                                      edge_to varchar(200) not NULL,
                                      CONSTRAINT roadmap_edges_pkey PRIMARY KEY (edge_id, roadmap_id)
);