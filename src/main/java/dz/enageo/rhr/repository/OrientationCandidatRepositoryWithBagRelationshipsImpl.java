package dz.enageo.rhr.repository;

import dz.enageo.rhr.domain.OrientationCandidat;
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
public class OrientationCandidatRepositoryWithBagRelationshipsImpl implements OrientationCandidatRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<OrientationCandidat> fetchBagRelationships(Optional<OrientationCandidat> orientationCandidat) {
        return orientationCandidat.map(this::fetchCandidats).map(this::fetchOrientations);
    }

    @Override
    public Page<OrientationCandidat> fetchBagRelationships(Page<OrientationCandidat> orientationCandidats) {
        return new PageImpl<>(
            fetchBagRelationships(orientationCandidats.getContent()),
            orientationCandidats.getPageable(),
            orientationCandidats.getTotalElements()
        );
    }

    @Override
    public List<OrientationCandidat> fetchBagRelationships(List<OrientationCandidat> orientationCandidats) {
        return Optional.of(orientationCandidats).map(this::fetchCandidats).map(this::fetchOrientations).orElse(Collections.emptyList());
    }

    OrientationCandidat fetchCandidats(OrientationCandidat result) {
        return entityManager
            .createQuery(
                "select orientationCandidat from OrientationCandidat orientationCandidat left join fetch orientationCandidat.candidats where orientationCandidat is :orientationCandidat",
                OrientationCandidat.class
            )
            .setParameter("orientationCandidat", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<OrientationCandidat> fetchCandidats(List<OrientationCandidat> orientationCandidats) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, orientationCandidats.size()).forEach(index -> order.put(orientationCandidats.get(index).getId(), index));
        List<OrientationCandidat> result = entityManager
            .createQuery(
                "select distinct orientationCandidat from OrientationCandidat orientationCandidat left join fetch orientationCandidat.candidats where orientationCandidat in :orientationCandidats",
                OrientationCandidat.class
            )
            .setParameter("orientationCandidats", orientationCandidats)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }

    OrientationCandidat fetchOrientations(OrientationCandidat result) {
        return entityManager
            .createQuery(
                "select orientationCandidat from OrientationCandidat orientationCandidat left join fetch orientationCandidat.orientations where orientationCandidat is :orientationCandidat",
                OrientationCandidat.class
            )
            .setParameter("orientationCandidat", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<OrientationCandidat> fetchOrientations(List<OrientationCandidat> orientationCandidats) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, orientationCandidats.size()).forEach(index -> order.put(orientationCandidats.get(index).getId(), index));
        List<OrientationCandidat> result = entityManager
            .createQuery(
                "select distinct orientationCandidat from OrientationCandidat orientationCandidat left join fetch orientationCandidat.orientations where orientationCandidat in :orientationCandidats",
                OrientationCandidat.class
            )
            .setParameter("orientationCandidats", orientationCandidats)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
