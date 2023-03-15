package dz.enageo.rhr.web.rest;

import dz.enageo.rhr.domain.Candidat;
import dz.enageo.rhr.repository.CandidatRepository;
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
 * REST controller for managing {@link dz.enageo.rhr.domain.Candidat}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CandidatResource {

    private final Logger log = LoggerFactory.getLogger(CandidatResource.class);

    private static final String ENTITY_NAME = "candidat";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CandidatRepository candidatRepository;

    public CandidatResource(CandidatRepository candidatRepository) {
        this.candidatRepository = candidatRepository;
    }

    /**
     * {@code POST  /candidats} : Create a new candidat.
     *
     * @param candidat the candidat to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new candidat, or with status {@code 400 (Bad Request)} if the candidat has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/candidats")
    public ResponseEntity<Candidat> createCandidat(@Valid @RequestBody Candidat candidat) throws URISyntaxException {
        log.debug("REST request to save Candidat : {}", candidat);
        if (candidat.getId() != null) {
            throw new BadRequestAlertException("A new candidat cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Candidat result = candidatRepository.save(candidat);
        return ResponseEntity
            .created(new URI("/api/candidats/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /candidats/:id} : Updates an existing candidat.
     *
     * @param id the id of the candidat to save.
     * @param candidat the candidat to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated candidat,
     * or with status {@code 400 (Bad Request)} if the candidat is not valid,
     * or with status {@code 500 (Internal Server Error)} if the candidat couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/candidats/{id}")
    public ResponseEntity<Candidat> updateCandidat(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Candidat candidat
    ) throws URISyntaxException {
        log.debug("REST request to update Candidat : {}, {}", id, candidat);
        if (candidat.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, candidat.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!candidatRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Candidat result = candidatRepository.save(candidat);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, candidat.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /candidats/:id} : Partial updates given fields of an existing candidat, field will ignore if it is null
     *
     * @param id the id of the candidat to save.
     * @param candidat the candidat to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated candidat,
     * or with status {@code 400 (Bad Request)} if the candidat is not valid,
     * or with status {@code 404 (Not Found)} if the candidat is not found,
     * or with status {@code 500 (Internal Server Error)} if the candidat couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/candidats/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Candidat> partialUpdateCandidat(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Candidat candidat
    ) throws URISyntaxException {
        log.debug("REST request to partial update Candidat partially : {}, {}", id, candidat);
        if (candidat.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, candidat.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!candidatRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Candidat> result = candidatRepository
            .findById(candidat.getId())
            .map(existingCandidat -> {
                if (candidat.getNom() != null) {
                    existingCandidat.setNom(candidat.getNom());
                }
                if (candidat.getPrenom() != null) {
                    existingCandidat.setPrenom(candidat.getPrenom());
                }
                if (candidat.getDateNaissance() != null) {
                    existingCandidat.setDateNaissance(candidat.getDateNaissance());
                }
                if (candidat.getTel() != null) {
                    existingCandidat.setTel(candidat.getTel());
                }
                if (candidat.getNumeroInscription() != null) {
                    existingCandidat.setNumeroInscription(candidat.getNumeroInscription());
                }

                return existingCandidat;
            })
            .map(candidatRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, candidat.getId().toString())
        );
    }

    /**
     * {@code GET  /candidats} : get all the candidats.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of candidats in body.
     */
    @GetMapping("/candidats")
    public List<Candidat> getAllCandidats() {
        log.debug("REST request to get all Candidats");
        return candidatRepository.findAll();
    }

    /**
     * {@code GET  /candidats/:id} : get the "id" candidat.
     *
     * @param id the id of the candidat to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the candidat, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/candidats/{id}")
    public ResponseEntity<Candidat> getCandidat(@PathVariable Long id) {
        log.debug("REST request to get Candidat : {}", id);
        Optional<Candidat> candidat = candidatRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(candidat);
    }

    /**
     * {@code DELETE  /candidats/:id} : delete the "id" candidat.
     *
     * @param id the id of the candidat to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/candidats/{id}")
    public ResponseEntity<Void> deleteCandidat(@PathVariable Long id) {
        log.debug("REST request to delete Candidat : {}", id);
        candidatRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
