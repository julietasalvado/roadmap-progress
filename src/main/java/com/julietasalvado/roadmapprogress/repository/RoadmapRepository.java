package com.julietasalvado.roadmapprogress.repository;

import com.julietasalvado.roadmapprogress.model.Roadmap;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;


// tag::code[]
@Repository
public interface RoadmapRepository extends PagingAndSortingRepository<Roadmap, Long> {

}
// end::code[]
