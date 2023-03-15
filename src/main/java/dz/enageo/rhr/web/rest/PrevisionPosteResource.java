package dz.enageo.rhr.web.rest;

import dz.enageo.rhr.domain.PrevisionPoste;
import dz.enageo.rhr.repository.PrevisionPosteRepository;
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
 * REST controller for managing {@link dz.enageo.rhr.domain.PrevisionPoste}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PrevisionPosteResource {

    private final Logger log = LoggerFactory.getLogger(PrevisionPosteResource.class);

    private static final String ENTITY_NAME = "previsionPoste";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PrevisionPosteRepository previsionPosteRepository;

    public PrevisionPosteResource(PrevisionPosteRepository previsionPosteRepository) {
        this.previsionPosteRepository = previsionPosteRepository;
    }

    /**
     * {@code POST  /prevision-postes} : Create a new previsionPoste.
     *
     * @param previsionPoste the previsionPoste to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new previsionPoste, or with status {@code 400 (Bad Request)} if the previsionPoste has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/prevision-postes")
    public ResponseEntity<PrevisionPoste> createPrevisionPoste(@RequestBody PrevisionPoste previsionPoste) throws URISyntaxException {
        log.debug("REST request to save PrevisionPoste : {}", previsionPoste);
        if (previsionPoste.getId() != null) {
            throw new BadRequestAlertException("A new previsionPoste cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PrevisionPoste result = previsionPosteRepository.save(previsionPoste);
        return ResponseEntity
            .created(new URI("/api/prevision-postes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /prevision-postes/:id} : Updates an existing previsionPoste.
     *
     * @param id the id of the previsionPoste to save.
     * @param previsionPoste the previsionPoste to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated previsionPoste,
     * or with status {@code 400 (Bad Request)} if the previsionPoste is not valid,
     * or with status {@code 500 (Internal Server Error)} if the previsionPoste couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/prevision-postes/{id}")
    public ResponseEntity<PrevisionPoste> updatePrevisionPoste(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PrevisionPoste previsionPoste
    ) throws URISyntaxException {
        log.debug("REST request to update PrevisionPoste : {}, {}", id, previsionPoste);
        if (previsionPoste.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, previsionPoste.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!previsionPosteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PrevisionPoste result = previsionPosteRepository.save(previsionPoste);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, previsionPoste.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /prevision-postes/:id} : Partial updates given fields of an existing previsionPoste, field will ignore if it is null
     *
     * @param id the id of the previsionPoste to save.
     * @param previsionPoste the previsionPoste to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated previsionPoste,
     * or with status {@code 400 (Bad Request)} if the previsionPoste is not valid,
     * or with status {@code 404 (Not Found)} if the previsionPoste is not found,
     * or with status {@code 500 (Internal Server Error)} if the previsionPoste couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/prevision-postes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PrevisionPoste> partialUpdatePrevisionPoste(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PrevisionPoste previsionPoste
    ) throws URISyntaxException {
        log.debug("REST request to partial update PrevisionPoste partially : {}, {}", id, previsionPoste);
        if (previsionPoste.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, previsionPoste.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!previsionPosteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PrevisionPoste> result = previsionPosteRepository
            .findById(previsionPoste.getId())
            .map(existingPrevisionPoste -> {
                if (previsionPoste.getDateAjout() != null) {
                    existingPrevisionPoste.setDateAjout(previsionPoste.getDateAjout());
                }

                return existingPrevisionPoste;
            })
            .map(previsionPosteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, previsionPoste.getId().toString())
        );
    }

    /**
     * {@code GET  /prevision-postes} : get all the previsionPostes.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of previsionPostes in body.
     */
    @GetMapping("/prevision-postes")
    public List<PrevisionPoste> getAllPrevisionPostes(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all PrevisionPostes");
        if (eagerload) {
            return previsionPosteRepository.findAllWithEagerRelationships();
        } else {
            return previsionPosteRepository.findAll();
        }
    }

    /**
     * {@code GET  /prevision-postes/:id} : get the "id" previsionPoste.
     *
     * @param id the id of the previsionPoste to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the previsionPoste, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/prevision-postes/{id}")
    public ResponseEntity<PrevisionPoste> getPrevisionPoste(@PathVariable Long id) {
        log.debug("REST request to get PrevisionPoste : {}", id);
        Optional<PrevisionPoste> previsionPoste = previsionPosteRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(previsionPoste);
    }

    /**
     * {@code DELETE  /prevision-postes/:id} : delete the "id" previsionPoste.
     *
     * @param id the id of the previsionPoste to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/prevision-postes/{id}")
    public ResponseEntity<Void> deletePrevisionPoste(@PathVariable Long id) {
        log.debug("REST request to delete PrevisionPoste : {}", id);
        previsionPosteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
