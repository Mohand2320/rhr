package dz.enageo.rhr.repository;

import dz.enageo.rhr.domain.PrevisionPoste;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface PrevisionPosteRepositoryWithBagRelationships {
    Optional<PrevisionPoste> fetchBagRelationships(Optional<PrevisionPoste> previsionPoste);

    List<PrevisionPoste> fetchBagRelationships(List<PrevisionPoste> previsionPostes);

    Page<PrevisionPoste> fetchBagRelationships(Page<PrevisionPoste> previsionPostes);
}
