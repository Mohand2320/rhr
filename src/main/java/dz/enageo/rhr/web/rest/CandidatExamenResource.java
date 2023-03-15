package dz.enageo.rhr.web.rest;

import dz.enageo.rhr.domain.CandidatExamen;
import dz.enageo.rhr.repository.CandidatExamenRepository;
import dz.enageo.rhr.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link dz.enageo.rhr.domain.CandidatExamen}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CandidatExamenResource {

    private final Logger log = LoggerFactory.getLogger(CandidatExamenResource.class);

    private static final String ENTITY_NAME = "candidatExamen";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CandidatExamenRepository candidatExamenRepository;

    public CandidatExamenResource(CandidatExamenRepository candidatExamenRepository) {
        this.candidatExamenRepository = candidatExamenRepository;
    }

    /**
     * {@code POST  /candidat-examen} : Create a new candidatExamen.
     *
     * @param candidatExamen the candidatExamen to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new candidatExamen, or with status {@code 400 (Bad Request)} if the candidatExamen has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/candidat-examen")
    public ResponseEntity<CandidatExamen> createCandidatExamen(@RequestBody CandidatExamen candidatExamen) throws URISyntaxException {
        log.debug("REST request to save CandidatExamen : {}", candidatExamen);
        if (candidatExamen.getId() != null) {
            throw new BadRequestAlertException("A new candidatExamen cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CandidatExamen result = candidatExamenRepository.save(candidatExamen);
        return ResponseEntity
            .created(new URI("/api/candidat-examen/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /candidat-examen/:id} : Updates an existing candidatExamen.
     *
     * @param id the id of the candidatExamen to save.
     * @param candidatExamen the candidatExamen to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated candidatExamen,
     * or with status {@code 400 (Bad Request)} if the candidatExamen is not valid,
     * or with status {@code 500 (Internal Server Error)} if the candidatExamen couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/candidat-examen/{id}")
    public ResponseEntity<CandidatExamen> updateCandidatExamen(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CandidatExamen candidatExamen
    ) throws URISyntaxException {
        log.debug("REST request to update CandidatExamen : {}, {}", id, candidatExamen);
        if (candidatExamen.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, candidatExamen.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!candidatExamenRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CandidatExamen result = candidatExamenRepository.save(candidatExamen);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, candidatExamen.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /candidat-examen/:id} : Partial updates given fields of an existing candidatExamen, field will ignore if it is null
     *
     * @param id the id of the candidatExamen to save.
     * @param candidatExamen the candidatExamen to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated candidatExamen,
     * or with status {@code 400 (Bad Request)} if the candidatExamen is not valid,
     * or with status {@code 404 (Not Found)} if the candidatExamen is not found,
     * or with status {@code 500 (Internal Server Error)} if the candidatExamen couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/candidat-examen/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CandidatExamen> partialUpdateCandidatExamen(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CandidatExamen candidatExamen
    ) throws URISyntaxException {
        log.debug("REST request to partial update CandidatExamen partially : {}, {}", id, candidatExamen);
        if (candidatExamen.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, candidatExamen.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!candidatExamenRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CandidatExamen> result = candidatExamenRepository
            .findById(candidatExamen.getId())
            .map(existingCandidatExamen -> {
                if (candidatExamen.getPresent() != null) {
                    existingCandidatExamen.setPresent(candidatExamen.getPresent());
                }
                if (candidatExamen.getAdmis() != null) {
                    existingCandidatExamen.setAdmis(candidatExamen.getAdmis());
                }
                if (candidatExamen.getReserve() != null) {
                    existingCandidatExamen.setReserve(candidatExamen.getReserve());
                }
                if (candidatExamen.getSituation() != null) {
                    existingCandidatExamen.setSituation(candidatExamen.getSituation());
                }

                return existingCandidatExamen;
            })
            .map(candidatExamenRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, candidatExamen.getId().toString())
        );
    }

    /**
     * {@code GET  /candidat-examen} : get all the candidatExamen.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of candidatExamen in body.
     */
    @GetMapping("/candidat-examen")
    public List<CandidatExamen> getAllCandidatExamen(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all CandidatExamen");
        if (eagerload) {
            return candidatExamenRepository.findAllWithEagerRelationships();
        } else {
            return candidatExamenRepository.findAll();
        }
    }

    /**
     * {@code GET  /candidat-examen/:id} : get the "id" candidatExamen.
     *
     * @param id the id of the candidatExamen to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the candidatExamen, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/candidat-examen/{id}")
    public ResponseEntity<CandidatExamen> getCandidatExamen(@PathVariable Long id) {
        log.debug("REST request to get CandidatExamen : {}", id);
        Optional<CandidatExamen> candidatExamen = candidatExamenRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(candidatExamen);
    }

    /**
     * {@code DELETE  /candidat-examen/:id} : delete the "id" candidatExamen.
     *
     * @param id the id of the candidatExamen to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/candidat-examen/{id}")
    public ResponseEntity<Void> deleteCandidatExamen(@PathVariable Long id) {
        log.debug("REST request to delete CandidatExamen : {}", id);
        candidatExamenRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
