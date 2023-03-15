package dz.enageo.rhr.web.rest;

import dz.enageo.rhr.domain.Poste;
import dz.enageo.rhr.repository.PosteRepository;
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
 * REST controller for managing {@link dz.enageo.rhr.domain.Poste}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PosteResource {

    private final Logger log = LoggerFactory.getLogger(PosteResource.class);

    private static final String ENTITY_NAME = "poste";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PosteRepository posteRepository;

    public PosteResource(PosteRepository posteRepository) {
        this.posteRepository = posteRepository;
    }

    /**
     * {@code POST  /postes} : Create a new poste.
     *
     * @param poste the poste to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new poste, or with status {@code 400 (Bad Request)} if the poste has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/postes")
    public ResponseEntity<Poste> createPoste(@Valid @RequestBody Poste poste) throws URISyntaxException {
        log.debug("REST request to save Poste : {}", poste);
        if (poste.getId() != null) {
            throw new BadRequestAlertException("A new poste cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Poste result = posteRepository.save(poste);
        return ResponseEntity
            .created(new URI("/api/postes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /postes/:id} : Updates an existing poste.
     *
     * @param id the id of the poste to save.
     * @param poste the poste to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated poste,
     * or with status {@code 400 (Bad Request)} if the poste is not valid,
     * or with status {@code 500 (Internal Server Error)} if the poste couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/postes/{id}")
    public ResponseEntity<Poste> updatePoste(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Poste poste)
        throws URISyntaxException {
        log.debug("REST request to update Poste : {}, {}", id, poste);
        if (poste.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, poste.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!posteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Poste result = posteRepository.save(poste);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, poste.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /postes/:id} : Partial updates given fields of an existing poste, field will ignore if it is null
     *
     * @param id the id of the poste to save.
     * @param poste the poste to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated poste,
     * or with status {@code 400 (Bad Request)} if the poste is not valid,
     * or with status {@code 404 (Not Found)} if the poste is not found,
     * or with status {@code 500 (Internal Server Error)} if the poste couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/postes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Poste> partialUpdatePoste(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Poste poste
    ) throws URISyntaxException {
        log.debug("REST request to partial update Poste partially : {}, {}", id, poste);
        if (poste.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, poste.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!posteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Poste> result = posteRepository
            .findById(poste.getId())
            .map(existingPoste -> {
                if (poste.getNomPoste() != null) {
                    existingPoste.setNomPoste(poste.getNomPoste());
                }
                if (poste.getNumeroPoste() != null) {
                    existingPoste.setNumeroPoste(poste.getNumeroPoste());
                }
                if (poste.getDiponible() != null) {
                    existingPoste.setDiponible(poste.getDiponible());
                }
                if (poste.getTypePoste() != null) {
                    existingPoste.setTypePoste(poste.getTypePoste());
                }

                return existingPoste;
            })
            .map(posteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, poste.getId().toString())
        );
    }

    /**
     * {@code GET  /postes} : get all the postes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of postes in body.
     */
    @GetMapping("/postes")
    public List<Poste> getAllPostes() {
        log.debug("REST request to get all Postes");
        return posteRepository.findAll();
    }

    /**
     * {@code GET  /postes/:id} : get the "id" poste.
     *
     * @param id the id of the poste to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the poste, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/postes/{id}")
    public ResponseEntity<Poste> getPoste(@PathVariable Long id) {
        log.debug("REST request to get Poste : {}", id);
        Optional<Poste> poste = posteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(poste);
    }

    /**
     * {@code DELETE  /postes/:id} : delete the "id" poste.
     *
     * @param id the id of the poste to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/postes/{id}")
    public ResponseEntity<Void> deletePoste(@PathVariable Long id) {
        log.debug("REST request to delete Poste : {}", id);
        posteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
