package dz.enageo.rhr.repository;

import dz.enageo.rhr.domain.PrevisionPoste;
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
public class PrevisionPosteRepositoryWithBagRelationshipsImpl implements PrevisionPosteRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<PrevisionPoste> fetchBagRelationships(Optional<PrevisionPoste> previsionPoste) {
        return previsionPoste.map(this::fetchPrevisions).map(this::fetchPostes);
    }

    @Override
    public Page<PrevisionPoste> fetchBagRelationships(Page<PrevisionPoste> previsionPostes) {
        return new PageImpl<>(
            fetchBagRelationships(previsionPostes.getContent()),
            previsionPostes.getPageable(),
            previsionPostes.getTotalElements()
        );
    }

    @Override
    public List<PrevisionPoste> fetchBagRelationships(List<PrevisionPoste> previsionPostes) {
        return Optional.of(previsionPostes).map(this::fetchPrevisions).map(this::fetchPostes).orElse(Collections.emptyList());
    }

    PrevisionPoste fetchPrevisions(PrevisionPoste result) {
        return entityManager
            .createQuery(
                "select previsionPoste from PrevisionPoste previsionPoste left join fetch previsionPoste.previsions where previsionPoste is :previsionPoste",
                PrevisionPoste.class
            )
            .setParameter("previsionPoste", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<PrevisionPoste> fetchPrevisions(List<PrevisionPoste> previsionPostes) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, previsionPostes.size()).forEach(index -> order.put(previsionPostes.get(index).getId(), index));
        List<PrevisionPoste> result = entityManager
            .createQuery(
                "select distinct previsionPoste from PrevisionPoste previsionPoste left join fetch previsionPoste.previsions where previsionPoste in :previsionPostes",
                PrevisionPoste.class
            )
            .setParameter("previsionPostes", previsionPostes)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }

    PrevisionPoste fetchPostes(PrevisionPoste result) {
        return entityManager
            .createQuery(
                "select previsionPoste from PrevisionPoste previsionPoste left join fetch previsionPoste.postes where previsionPoste is :previsionPoste",
                PrevisionPoste.class
            )
            .setParameter("previsionPoste", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<PrevisionPoste> fetchPostes(List<PrevisionPoste> previsionPostes) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, previsionPostes.size()).forEach(index -> order.put(previsionPostes.get(index).getId(), index));
        List<PrevisionPoste> result = entityManager
            .createQuery(
                "select distinct previsionPoste from PrevisionPoste previsionPoste left join fetch previsionPoste.postes where previsionPoste in :previsionPostes",
                PrevisionPoste.class
            )
            .setParameter("previsionPostes", previsionPostes)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
