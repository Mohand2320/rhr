package dz.enageo.rhr.web.rest;

import dz.enageo.rhr.domain.Accord;
import dz.enageo.rhr.repository.AccordRepository;
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
 * REST controller for managing {@link dz.enageo.rhr.domain.Accord}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AccordResource {

    private final Logger log = LoggerFactory.getLogger(AccordResource.class);

    private static final String ENTITY_NAME = "accord";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AccordRepository accordRepository;

    public AccordResource(AccordRepository accordRepository) {
        this.accordRepository = accordRepository;
    }

    /**
     * {@code POST  /accords} : Create a new accord.
     *
     * @param accord the accord to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new accord, or with status {@code 400 (Bad Request)} if the accord has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/accords")
    public ResponseEntity<Accord> createAccord(@Valid @RequestBody Accord accord) throws URISyntaxException {
        log.debug("REST request to save Accord : {}", accord);
        if (accord.getId() != null) {
            throw new BadRequestAlertException("A new accord cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Accord result = accordRepository.save(accord);
        return ResponseEntity
            .created(new URI("/api/accords/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /accords/:id} : Updates an existing accord.
     *
     * @param id the id of the accord to save.
     * @param accord the accord to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated accord,
     * or with status {@code 400 (Bad Request)} if the accord is not valid,
     * or with status {@code 500 (Internal Server Error)} if the accord couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/accords/{id}")
    public ResponseEntity<Accord> updateAccord(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Accord accord
    ) throws URISyntaxException {
        log.debug("REST request to update Accord : {}, {}", id, accord);
        if (accord.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, accord.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!accordRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Accord result = accordRepository.save(accord);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, accord.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /accords/:id} : Partial updates given fields of an existing accord, field will ignore if it is null
     *
     * @param id the id of the accord to save.
     * @param accord the accord to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated accord,
     * or with status {@code 400 (Bad Request)} if the accord is not valid,
     * or with status {@code 404 (Not Found)} if the accord is not found,
     * or with status {@code 500 (Internal Server Error)} if the accord couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/accords/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Accord> partialUpdateAccord(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Accord accord
    ) throws URISyntaxException {
        log.debug("REST request to partial update Accord partially : {}, {}", id, accord);
        if (accord.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, accord.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!accordRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Accord> result = accordRepository
            .findById(accord.getId())
            .map(existingAccord -> {
                if (accord.getValidateur() != null) {
                    existingAccord.setValidateur(accord.getValidateur());
                }
                if (accord.getNumeroAccord() != null) {
                    existingAccord.setNumeroAccord(accord.getNumeroAccord());
                }
                if (accord.getDateArrivee() != null) {
                    existingAccord.setDateArrivee(accord.getDateArrivee());
                }

                return existingAccord;
            })
            .map(accordRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, accord.getId().toString())
        );
    }

    /**
     * {@code GET  /accords} : get all the accords.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of accords in body.
     */
    @GetMapping("/accords")
    public List<Accord> getAllAccords() {
        log.debug("REST request to get all Accords");
        return accordRepository.findAll();
    }

    /**
     * {@code GET  /accords/:id} : get the "id" accord.
     *
     * @param id the id of the accord to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the accord, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/accords/{id}")
    public ResponseEntity<Accord> getAccord(@PathVariable Long id) {
        log.debug("REST request to get Accord : {}", id);
        Optional<Accord> accord = accordRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(accord);
    }

    /**
     * {@code DELETE  /accords/:id} : delete the "id" accord.
     *
     * @param id the id of the accord to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/accords/{id}")
    public ResponseEntity<Void> deleteAccord(@PathVariable Long id) {
        log.debug("REST request to delete Accord : {}", id);
        accordRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
