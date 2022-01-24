CREATE TABLE public.roadmap_nodes (
                                      node_id varchar(200) NOT NULL,
                                      roadmap_id serial NOT NULL,
                                      height int not NULL,
                                      width int not NULL,
                                      type varchar(20) not NULL,
                                      title varchar(200) NOT NULL,
                                      CONSTRAINT roadmap_nodes_pkey PRIMARY KEY (node_id, roadmap_id)
);