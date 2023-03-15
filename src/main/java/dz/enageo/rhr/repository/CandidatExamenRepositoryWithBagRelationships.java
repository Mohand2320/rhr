package dz.enageo.rhr.repository;

import dz.enageo.rhr.domain.CandidatExamen;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface CandidatExamenRepositoryWithBagRelationships {
    Optional<CandidatExamen> fetchBagRelationships(Optional<CandidatExamen> candidatExamen);

    List<CandidatExamen> fetchBagRelationships(List<CandidatExamen> candidatExamen);

    Page<CandidatExamen> fetchBagRelationships(Page<CandidatExamen> candidatExamen);
}
