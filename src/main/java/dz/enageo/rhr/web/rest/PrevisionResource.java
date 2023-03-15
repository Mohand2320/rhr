package dz.enageo.rhr.web.rest;

import dz.enageo.rhr.domain.Prevision;
import dz.enageo.rhr.repository.PrevisionRepository;
import dz.enageo.rhr.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link dz.enageo.rhr.domain.Prevision}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PrevisionResource {

    private final Logger log = LoggerFactory.getLogger(PrevisionResource.class);

    private static final String ENTITY_NAME = "prevision";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PrevisionRepository previsionRepository;

    public PrevisionResource(PrevisionRepository previsionRepository) {
        this.previsionRepository = previsionRepository;
    }

    /**
     * {@code POST  /previsions} : Create a new prevision.
     *
     * @param prevision the prevision to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new prevision, or with status {@code 400 (Bad Request)} if the prevision has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/previsions")
    public ResponseEntity<Prevision> createPrevision(@Valid @RequestBody Prevision prevision) throws URISyntaxException {
        log.debug("REST request to save Prevision : {}", prevision);
        if (prevision.getId() != null) {
            throw new BadRequestAlertException("A new prevision cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Prevision result = previsionRepository.save(prevision);
        return ResponseEntity
            .created(new URI("/api/previsions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /previsions/:id} : Updates an existing prevision.
     *
     * @param id the id of the prevision to save.
     * @param prevision the prevision to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated prevision,
     * or with status {@code 400 (Bad Request)} if the prevision is not valid,
     * or with status {@code 500 (Internal Server Error)} if the prevision couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/previsions/{id}")
    public ResponseEntity<Prevision> updatePrevision(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Prevision prevision
    ) throws URISyntaxException {
        log.debug("REST request to update Prevision : {}, {}", id, prevision);
        if (prevision.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, prevision.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!previsionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Prevision result = previsionRepository.save(prevision);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, prevision.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /previsions/:id} : Partial updates given fields of an existing prevision, field will ignore if it is null
     *
     * @param id the id of the prevision to save.
     * @param prevision the prevision to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated prevision,
     * or with status {@code 400 (Bad Request)} if the prevision is not valid,
     * or with status {@code 404 (Not Found)} if the prevision is not found,
     * or with status {@code 500 (Internal Server Error)} if the prevision couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/previsions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Prevision> partialUpdatePrevision(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Prevision prevision
    ) throws URISyntaxException {
        log.debug("REST request to partial update Prevision partially : {}, {}", id, prevision);
        if (prevision.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, prevision.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!previsionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Prevision> result = previsionRepository
            .findById(prevision.getId())
            .map(existingPrevision -> {
                if (prevision.getDateAjout() != null) {
                    existingPrevision.setDateAjout(prevision.getDateAjout());
                }

                return existingPrevision;
            })
            .map(previsionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, prevision.getId().toString())
        );
    }

    /**
     * {@code GET  /previsions} : get all the previsions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of previsions in body.
     */
    @GetMapping("/previsions")
    public List<Prevision> getAllPrevisions() {
        log.debug("REST request to get all Previsions");
        return previsionRepository.findAll();
    }

    /**
     * {@code GET  /previsions/:id} : get the "id" prevision.
     *
     * @param id the id of the prevision to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the prevision, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/previsions/{id}")
    public ResponseEntity<Prevision> getPrevision(@PathVariable Long id) {
        log.debug("REST request to get Prevision : {}", id);
        Optional<Prevision> prevision = previsionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(prevision);
    }

    /**
     * {@code DELETE  /previsions/:id} : delete the "id" prevision.
     *
     * @param id the id of the prevision to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/previsions/{id}")
    public ResponseEntity<Void> deletePrevision(@PathVariable Long id) {
        log.debug("REST request to delete Prevision : {}", id);
        previsionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
