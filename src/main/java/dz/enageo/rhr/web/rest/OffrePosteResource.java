package dz.enageo.rhr.web.rest;

import dz.enageo.rhr.domain.OffrePoste;
import dz.enageo.rhr.repository.OffrePosteRepository;
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
 * REST controller for managing {@link dz.enageo.rhr.domain.OffrePoste}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OffrePosteResource {

    private final Logger log = LoggerFactory.getLogger(OffrePosteResource.class);

    private static final String ENTITY_NAME = "offrePoste";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OffrePosteRepository offrePosteRepository;

    public OffrePosteResource(OffrePosteRepository offrePosteRepository) {
        this.offrePosteRepository = offrePosteRepository;
    }

    /**
     * {@code POST  /offre-postes} : Create a new offrePoste.
     *
     * @param offrePoste the offrePoste to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new offrePoste, or with status {@code 400 (Bad Request)} if the offrePoste has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/offre-postes")
    public ResponseEntity<OffrePoste> createOffrePoste(@Valid @RequestBody OffrePoste offrePoste) throws URISyntaxException {
        log.debug("REST request to save OffrePoste : {}", offrePoste);
        if (offrePoste.getId() != null) {
            throw new BadRequestAlertException("A new offrePoste cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OffrePoste result = offrePosteRepository.save(offrePoste);
        return ResponseEntity
            .created(new URI("/api/offre-postes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /offre-postes/:id} : Updates an existing offrePoste.
     *
     * @param id the id of the offrePoste to save.
     * @param offrePoste the offrePoste to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated offrePoste,
     * or with status {@code 400 (Bad Request)} if the offrePoste is not valid,
     * or with status {@code 500 (Internal Server Error)} if the offrePoste couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/offre-postes/{id}")
    public ResponseEntity<OffrePoste> updateOffrePoste(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody OffrePoste offrePoste
    ) throws URISyntaxException {
        log.debug("REST request to update OffrePoste : {}, {}", id, offrePoste);
        if (offrePoste.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, offrePoste.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!offrePosteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        OffrePoste result = offrePosteRepository.save(offrePoste);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, offrePoste.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /offre-postes/:id} : Partial updates given fields of an existing offrePoste, field will ignore if it is null
     *
     * @param id the id of the offrePoste to save.
     * @param offrePoste the offrePoste to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated offrePoste,
     * or with status {@code 400 (Bad Request)} if the offrePoste is not valid,
     * or with status {@code 404 (Not Found)} if the offrePoste is not found,
     * or with status {@code 500 (Internal Server Error)} if the offrePoste couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/offre-postes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OffrePoste> partialUpdateOffrePoste(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody OffrePoste offrePoste
    ) throws URISyntaxException {
        log.debug("REST request to partial update OffrePoste partially : {}, {}", id, offrePoste);
        if (offrePoste.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, offrePoste.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!offrePosteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OffrePoste> result = offrePosteRepository
            .findById(offrePoste.getId())
            .map(existingOffrePoste -> {
                if (offrePoste.getNbr() != null) {
                    existingOffrePoste.setNbr(offrePoste.getNbr());
                }
                if (offrePoste.getExigence() != null) {
                    existingOffrePoste.setExigence(offrePoste.getExigence());
                }

                return existingOffrePoste;
            })
            .map(offrePosteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, offrePoste.getId().toString())
        );
    }

    /**
     * {@code GET  /offre-postes} : get all the offrePostes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of offrePostes in body.
     */
    @GetMapping("/offre-postes")
    public List<OffrePoste> getAllOffrePostes() {
        log.debug("REST request to get all OffrePostes");
        return offrePosteRepository.findAll();
    }

    /**
     * {@code GET  /offre-postes/:id} : get the "id" offrePoste.
     *
     * @param id the id of the offrePoste to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the offrePoste, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/offre-postes/{id}")
    public ResponseEntity<OffrePoste> getOffrePoste(@PathVariable Long id) {
        log.debug("REST request to get OffrePoste : {}", id);
        Optional<OffrePoste> offrePoste = offrePosteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(offrePoste);
    }

    /**
     * {@code DELETE  /offre-postes/:id} : delete the "id" offrePoste.
     *
     * @param id the id of the offrePoste to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/offre-postes/{id}")
    public ResponseEntity<Void> deleteOffrePoste(@PathVariable Long id) {
        log.debug("REST request to delete OffrePoste : {}", id);
        offrePosteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
