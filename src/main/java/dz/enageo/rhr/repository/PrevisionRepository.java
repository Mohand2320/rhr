package dz.enageo.rhr.repository;

import dz.enageo.rhr.domain.Prevision;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Prevision entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PrevisionRepository extends JpaRepository<Prevision, Long> {}
