package dz.enageo.rhr.repository;

import dz.enageo.rhr.domain.Orientation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Orientation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrientationRepository extends JpaRepository<Orientation, Long> {}
