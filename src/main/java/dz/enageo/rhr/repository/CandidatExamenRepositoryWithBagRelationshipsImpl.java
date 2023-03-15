package dz.enageo.rhr.repository;

import dz.enageo.rhr.domain.CandidatExamen;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class CandidatExamenRepositoryWithBagRelationshipsImpl implements CandidatExamenRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<CandidatExamen> fetchBagRelationships(Optional<CandidatExamen> candidatExamen) {
        return candidatExamen.map(this::fetchCandidats).map(this::fetchExamen);
    }

    @Override
    public Page<CandidatExamen> fetchBagRelationships(Page<CandidatExamen> candidatExamen) {
        return new PageImpl<>(
            fetchBagRelationships(candidatExamen.getContent()),
            candidatExamen.getPageable(),
            candidatExamen.getTotalElements()
        );
    }

    @Override
    public List<CandidatExamen> fetchBagRelationships(List<CandidatExamen> candidatExamen) {
        return Optional.of(candidatExamen).map(this::fetchCandidats).map(this::fetchExamen).orElse(Collections.emptyList());
    }

    CandidatExamen fetchCandidats(CandidatExamen result) {
        return entityManager
            .createQuery(
                "select candidatExamen from CandidatExamen candidatExamen left join fetch candidatExamen.candidats where candidatExamen is :candidatExamen",
                CandidatExamen.class
            )
            .setParameter("candidatExamen", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<CandidatExamen> fetchCandidats(List<CandidatExamen> candidatExamen) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, candidatExamen.size()).forEach(index -> order.put(candidatExamen.get(index).getId(), index));
        List<CandidatExamen> result = entityManager
            .createQuery(
                "select distinct candidatExamen from CandidatExamen candidatExamen left join fetch candidatExamen.candidats where candidatExamen in :candidatExamen",
                CandidatExamen.class
            )
            .setParameter("candidatExamen", candidatExamen)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }

    CandidatExamen fetchExamen(CandidatExamen result) {
        return entityManager
            .createQuery(
                "select candidatExamen from CandidatExamen candidatExamen left join fetch candidatExamen.examen where candidatExamen is :candidatExamen",
                CandidatExamen.class
            )
            .setParameter("candidatExamen", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<CandidatExamen> fetchExamen(List<CandidatExamen> candidatExamen) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, candidatExamen.size()).forEach(index -> order.put(candidatExamen.get(index).getId(), index));
        List<CandidatExamen> result = entityManager
            .createQuery(
                "select distinct candidatExamen from CandidatExamen candidatExamen left join fetch candidatExamen.examen where candidatExamen in :candidatExamen",
                CandidatExamen.class
            )
            .setParameter("candidatExamen", candidatExamen)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
