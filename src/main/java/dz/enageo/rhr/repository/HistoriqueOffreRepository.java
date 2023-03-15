package dz.enageo.rhr.repository;

import dz.enageo.rhr.domain.HistoriqueOffre;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the HistoriqueOffre entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HistoriqueOffreRepository extends JpaRepository<HistoriqueOffre, Long> {}
