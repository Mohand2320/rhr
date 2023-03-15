package dz.enageo.rhr.web.rest;

import dz.enageo.rhr.domain.Orientation;
import dz.enageo.rhr.repository.OrientationRepository;
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
 * REST controller for managing {@link dz.enageo.rhr.domain.Orientation}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OrientationResource {

    private final Logger log = LoggerFactory.getLogger(OrientationResource.class);

    private static final String ENTITY_NAME = "orientation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrientationRepository orientationRepository;

    public OrientationResource(OrientationRepository orientationRepository) {
        this.orientationRepository = orientationRepository;
    }

    /**
     * {@code POST  /orientations} : Create a new orientation.
     *
     * @param orientation the orientation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orientation, or with status {@code 400 (Bad Request)} if the orientation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/orientations")
    public ResponseEntity<Orientation> createOrientation(@Valid @RequestBody Orientation orientation) throws URISyntaxException {
        log.debug("REST request to save Orientation : {}", orientation);
        if (orientation.getId() != null) {
            throw new BadRequestAlertException("A new orientation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Orientation result = orientationRepository.save(orientation);
        return ResponseEntity
            .created(new URI("/api/orientations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /orientations/:id} : Updates an existing orientation.
     *
     * @param id the id of the orientation to save.
     * @param orientation the orientation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orientation,
     * or with status {@code 400 (Bad Request)} if the orientation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the orientation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/orientations/{id}")
    public ResponseEntity<Orientation> updateOrientation(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Orientation orientation
    ) throws URISyntaxException {
        log.debug("REST request to update Orientation : {}, {}", id, orientation);
        if (orientation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orientation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orientationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Orientation result = orientationRepository.save(orientation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orientation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /orientations/:id} : Partial updates given fields of an existing orientation, field will ignore if it is null
     *
     * @param id the id of the orientation to save.
     * @param orientation the orientation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orientation,
     * or with status {@code 400 (Bad Request)} if the orientation is not valid,
     * or with status {@code 404 (Not Found)} if the orientation is not found,
     * or with status {@code 500 (Internal Server Error)} if the orientation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/orientations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Orientation> partialUpdateOrientation(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Orientation orientation
    ) throws URISyntaxException {
        log.debug("REST request to partial update Orientation partially : {}, {}", id, orientation);
        if (orientation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orientation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orientationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Orientation> result = orientationRepository
            .findById(orientation.getId())
            .map(existingOrientation -> {
                if (orientation.getLibelle() != null) {
                    existingOrientation.setLibelle(orientation.getLibelle());
                }

                return existingOrientation;
            })
            .map(orientationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orientation.getId().toString())
        );
    }

    /**
     * {@code GET  /orientations} : get all the orientations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orientations in body.
     */
    @GetMapping("/orientations")
    public List<Orientation> getAllOrientations() {
        log.debug("REST request to get all Orientations");
        return orientationRepository.findAll();
    }

    /**
     * {@code GET  /orientations/:id} : get the "id" orientation.
     *
     * @param id the id of the orientation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orientation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/orientations/{id}")
    public ResponseEntity<Orientation> getOrientation(@PathVariable Long id) {
        log.debug("REST request to get Orientation : {}", id);
        Optional<Orientation> orientation = orientationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(orientation);
    }

    /**
     * {@code DELETE  /orientations/:id} : delete the "id" orientation.
     *
     * @param id the id of the orientation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/orientations/{id}")
    public ResponseEntity<Void> deleteOrientation(@PathVariable Long id) {
        log.debug("REST request to delete Orientation : {}", id);
        orientationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
