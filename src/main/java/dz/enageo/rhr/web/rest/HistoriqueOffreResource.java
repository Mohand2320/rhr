package dz.enageo.rhr.web.rest;

import dz.enageo.rhr.domain.HistoriqueOffre;
import dz.enageo.rhr.repository.HistoriqueOffreRepository;
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
 * REST controller for managing {@link dz.enageo.rhr.domain.HistoriqueOffre}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class HistoriqueOffreResource {

    private final Logger log = LoggerFactory.getLogger(HistoriqueOffreResource.class);

    private static final String ENTITY_NAME = "historiqueOffre";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HistoriqueOffreRepository historiqueOffreRepository;

    public HistoriqueOffreResource(HistoriqueOffreRepository historiqueOffreRepository) {
        this.historiqueOffreRepository = historiqueOffreRepository;
    }

    /**
     * {@code POST  /historique-offres} : Create a new historiqueOffre.
     *
     * @param historiqueOffre the historiqueOffre to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new historiqueOffre, or with status {@code 400 (Bad Request)} if the historiqueOffre has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/historique-offres")
    public ResponseEntity<HistoriqueOffre> createHistoriqueOffre(@Valid @RequestBody HistoriqueOffre historiqueOffre)
        throws URISyntaxException {
        log.debug("REST request to save HistoriqueOffre : {}", historiqueOffre);
        if (historiqueOffre.getId() != null) {
            throw new BadRequestAlertException("A new historiqueOffre cannot already have an ID", ENTITY_NAME, "idexists");
        }
        HistoriqueOffre result = historiqueOffreRepository.save(historiqueOffre);
        return ResponseEntity
            .created(new URI("/api/historique-offres/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /historique-offres/:id} : Updates an existing historiqueOffre.
     *
     * @param id the id of the historiqueOffre to save.
     * @param historiqueOffre the historiqueOffre to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated historiqueOffre,
     * or with status {@code 400 (Bad Request)} if the historiqueOffre is not valid,
     * or with status {@code 500 (Internal Server Error)} if the historiqueOffre couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/historique-offres/{id}")
    public ResponseEntity<HistoriqueOffre> updateHistoriqueOffre(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody HistoriqueOffre historiqueOffre
    ) throws URISyntaxException {
        log.debug("REST request to update HistoriqueOffre : {}, {}", id, historiqueOffre);
        if (historiqueOffre.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, historiqueOffre.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!historiqueOffreRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        HistoriqueOffre result = historiqueOffreRepository.save(historiqueOffre);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, historiqueOffre.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /historique-offres/:id} : Partial updates given fields of an existing historiqueOffre, field will ignore if it is null
     *
     * @param id the id of the historiqueOffre to save.
     * @param historiqueOffre the historiqueOffre to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated historiqueOffre,
     * or with status {@code 400 (Bad Request)} if the historiqueOffre is not valid,
     * or with status {@code 404 (Not Found)} if the historiqueOffre is not found,
     * or with status {@code 500 (Internal Server Error)} if the historiqueOffre couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/historique-offres/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<HistoriqueOffre> partialUpdateHistoriqueOffre(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody HistoriqueOffre historiqueOffre
    ) throws URISyntaxException {
        log.debug("REST request to partial update HistoriqueOffre partially : {}, {}", id, historiqueOffre);
        if (historiqueOffre.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, historiqueOffre.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!historiqueOffreRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<HistoriqueOffre> result = historiqueOffreRepository
            .findById(historiqueOffre.getId())
            .map(existingHistoriqueOffre -> {
                if (historiqueOffre.getDateHistorique() != null) {
                    existingHistoriqueOffre.setDateHistorique(historiqueOffre.getDateHistorique());
                }
                if (historiqueOffre.getEtat() != null) {
                    existingHistoriqueOffre.setEtat(historiqueOffre.getEtat());
                }

                return existingHistoriqueOffre;
            })
            .map(historiqueOffreRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, historiqueOffre.getId().toString())
        );
    }

    /**
     * {@code GET  /historique-offres} : get all the historiqueOffres.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of historiqueOffres in body.
     */
    @GetMapping("/historique-offres")
    public List<HistoriqueOffre> getAllHistoriqueOffres() {
        log.debug("REST request to get all HistoriqueOffres");
        return historiqueOffreRepository.findAll();
    }

    /**
     * {@code GET  /historique-offres/:id} : get the "id" historiqueOffre.
     *
     * @param id the id of the historiqueOffre to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the historiqueOffre, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/historique-offres/{id}")
    public ResponseEntity<HistoriqueOffre> getHistoriqueOffre(@PathVariable Long id) {
        log.debug("REST request to get HistoriqueOffre : {}", id);
        Optional<HistoriqueOffre> historiqueOffre = historiqueOffreRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(historiqueOffre);
    }

    /**
     * {@code DELETE  /historique-offres/:id} : delete the "id" historiqueOffre.
     *
     * @param id the id of the historiqueOffre to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/historique-offres/{id}")
    public ResponseEntity<Void> deleteHistoriqueOffre(@PathVariable Long id) {
        log.debug("REST request to delete HistoriqueOffre : {}", id);
        historiqueOffreRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
