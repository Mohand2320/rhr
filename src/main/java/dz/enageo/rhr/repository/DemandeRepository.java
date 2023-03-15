package dz.enageo.rhr.repository;

import dz.enageo.rhr.domain.Demande;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Demande entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DemandeRepository extends JpaRepository<Demande, Long> {}