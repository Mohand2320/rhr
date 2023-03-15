package dz.enageo.rhr.repository;

import dz.enageo.rhr.domain.OffrePoste;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the OffrePoste entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OffrePosteRepository extends JpaRepository<OffrePoste, Long> {}
