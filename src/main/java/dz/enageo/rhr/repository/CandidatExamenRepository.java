package dz.enageo.rhr.repository;

import dz.enageo.rhr.domain.CandidatExamen;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CandidatExamen entity.
 *
 * When extending this class, extend CandidatExamenRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface CandidatExamenRepository extends CandidatExamenRepositoryWithBagRelationships, JpaRepository<CandidatExamen, Long> {
    default Optional<CandidatExamen> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<CandidatExamen> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<CandidatExamen> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }
}
