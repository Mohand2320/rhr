package dz.enageo.rhr.repository;

import dz.enageo.rhr.domain.OrientationCandidat;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface OrientationCandidatRepositoryWithBagRelationships {
    Optional<OrientationCandidat> fetchBagRelationships(Optional<OrientationCandidat> orientationCandidat);

    List<OrientationCandidat> fetchBagRelationships(List<OrientationCandidat> orientationCandidats);

    Page<OrientationCandidat> fetchBagRelationships(Page<OrientationCandidat> orientationCandidats);
}
