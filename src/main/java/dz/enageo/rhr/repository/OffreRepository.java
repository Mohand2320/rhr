package dz.enageo.rhr.repository;

import dz.enageo.rhr.domain.Offre;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Offre entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OffreRepository extends JpaRepository<Offre, Long> {}
