package dz.enageo.rhr.repository;

import dz.enageo.rhr.domain.Accord;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Accord entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AccordRepository extends JpaRepository<Accord, Long> {}
