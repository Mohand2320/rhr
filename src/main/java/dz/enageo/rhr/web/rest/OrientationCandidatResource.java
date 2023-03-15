package dz.enageo.rhr.web.rest;

import dz.enageo.rhr.domain.OrientationCandidat;
import dz.enageo.rhr.repository.OrientationCandidatRepository;
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
 * REST controller for managing {@link dz.enageo.rhr.domain.OrientationCandidat}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OrientationCandidatResource {

    private final Logger log = LoggerFactory.getLogger(OrientationCandidatResource.class);

    private static final String ENTITY_NAME = "orientationCandidat";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrientationCandidatRepository orientationCandidatRepository;

    public OrientationCandidatResource(OrientationCandidatRepository orientationCandidatRepository) {
        this.orientationCandidatRepository = orientationCandidatRepository;
    }

    /**
     * {@code POST  /orientation-candidats} : Create a new orientationCandidat.
     *
     * @param orientationCandidat the orientationCandidat to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orientationCandidat, or with status {@code 400 (Bad Request)} if the orientationCandidat has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/orientation-candidats")
    public ResponseEntity<OrientationCandidat> createOrientationCandidat(@RequestBody OrientationCandidat orientationCandidat)
        throws URISyntaxException {
        log.debug("REST request to save OrientationCandidat : {}", orientationCandidat);
        if (orientationCandidat.getId() != null) {
            throw new BadRequestAlertException("A new orientationCandidat cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OrientationCandidat result = orientationCandidatRepository.save(orientationCandidat);
        return ResponseEntity
            .created(new URI("/api/orientation-candidats/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /orientation-candidats/:id} : Updates an existing orientationCandidat.
     *
     * @param id the id of the orientationCandidat to save.
     * @param orientationCandidat the orientationCandidat to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orientationCandidat,
     * or with status {@code 400 (Bad Request)} if the orientationCandidat is not valid,
     * or with status {@code 500 (Internal Server Error)} if the orientationCandidat couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/orientation-candidats/{id}")
    public ResponseEntity<OrientationCandidat> updateOrientationCandidat(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OrientationCandidat orientationCandidat
    ) throws URISyntaxException {
        log.debug("REST request to update OrientationCandidat : {}, {}", id, orientationCandidat);
        if (orientationCandidat.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orientationCandidat.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orientationCandidatRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        OrientationCandidat result = orientationCandidatRepository.save(orientationCandidat);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orientationCandidat.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /orientation-candidats/:id} : Partial updates given fields of an existing orientationCandidat, field will ignore if it is null
     *
     * @param id the id of the orientationCandidat to save.
     * @param orientationCandidat the orientationCandidat to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orientationCandidat,
     * or with status {@code 400 (Bad Request)} if the orientationCandidat is not valid,
     * or with status {@code 404 (Not Found)} if the orientationCandidat is not found,
     * or with status {@code 500 (Internal Server Error)} if the orientationCandidat couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/orientation-candidats/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OrientationCandidat> partialUpdateOrientationCandidat(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody OrientationCandidat orientationCandidat
    ) throws URISyntaxException {
        log.debug("REST request to partial update OrientationCandidat partially : {}, {}", id, orientationCandidat);
        if (orientationCandidat.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orientationCandidat.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orientationCandidatRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OrientationCandidat> result = orientationCandidatRepository
            .findById(orientationCandidat.getId())
            .map(existingOrientationCandidat -> {
                if (orientationCandidat.getDateOrientation() != null) {
                    existingOrientationCandidat.setDateOrientation(orientationCandidat.getDateOrientation());
                }

                return existingOrientationCandidat;
            })
            .map(orientationCandidatRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orientationCandidat.getId().toString())
        );
    }

    /**
     * {@code GET  /orientation-candidats} : get all the orientationCandidats.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orientationCandidats in body.
     */
    @GetMapping("/orientation-candidats")
    public List<OrientationCandidat> getAllOrientationCandidats(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all OrientationCandidats");
        if (eagerload) {
            return orientationCandidatRepository.findAllWithEagerRelationships();
        } else {
            return orientationCandidatRepository.findAll();
        }
    }

    /**
     * {@code GET  /orientation-candidats/:id} : get the "id" orientationCandidat.
     *
     * @param id the id of the orientationCandidat to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orientationCandidat, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/orientation-candidats/{id}")
    public ResponseEntity<OrientationCandidat> getOrientationCandidat(@PathVariable Long id) {
        log.debug("REST request to get OrientationCandidat : {}", id);
        Optional<OrientationCandidat> orientationCandidat = orientationCandidatRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(orientationCandidat);
    }

    /**
     * {@code DELETE  /orientation-candidats/:id} : delete the "id" orientationCandidat.
     *
     * @param id the id of the orientationCandidat to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/orientation-candidats/{id}")
    public ResponseEntity<Void> deleteOrientationCandidat(@PathVariable Long id) {
        log.debug("REST request to delete OrientationCandidat : {}", id);
        orientationCandidatRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
