package dz.enageo.rhr.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import dz.enageo.rhr.IntegrationTest;
import dz.enageo.rhr.domain.Examen;
import dz.enageo.rhr.domain.enumeration.Etat;
import dz.enageo.rhr.repository.ExamenRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ExamenResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ExamenResourceIT {

    private static final LocalDate DEFAULT_DATE_PREVUE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_PREVUE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_EXAMEN = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_EXAMEN = LocalDate.now(ZoneId.systemDefault());

    private static final Etat DEFAULT_ETAT = Etat.ETAT1;
    private static final Etat UPDATED_ETAT = Etat.ETAT2;

    private static final String DEFAULT_LIEU_EXAMEN = "AAAAAAAAAA";
    private static final String UPDATED_LIEU_EXAMEN = "BBBBBBBBBB";

    private static final String DEFAULT_MINI_DOSSIER = "AAAAAAAAAA";
    private static final String UPDATED_MINI_DOSSIER = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/examen";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ExamenRepository examenRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restExamenMockMvc;

    private Examen examen;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Examen createEntity(EntityManager em) {
        Examen examen = new Examen()
            .datePrevue(DEFAULT_DATE_PREVUE)
            .dateExamen(DEFAULT_DATE_EXAMEN)
            .etat(DEFAULT_ETAT)
            .lieuExamen(DEFAULT_LIEU_EXAMEN)
            .miniDossier(DEFAULT_MINI_DOSSIER);
        return examen;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Examen createUpdatedEntity(EntityManager em) {
        Examen examen = new Examen()
            .datePrevue(UPDATED_DATE_PREVUE)
            .dateExamen(UPDATED_DATE_EXAMEN)
            .etat(UPDATED_ETAT)
            .lieuExamen(UPDATED_LIEU_EXAMEN)
            .miniDossier(UPDATED_MINI_DOSSIER);
        return examen;
    }

    @BeforeEach
    public void initTest() {
        examen = createEntity(em);
    }

    @Test
    @Transactional
    void createExamen() throws Exception {
        int databaseSizeBeforeCreate = examenRepository.findAll().size();
        // Create the Examen
        restExamenMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(examen)))
            .andExpect(status().isCreated());

        // Validate the Examen in the database
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeCreate + 1);
        Examen testExamen = examenList.get(examenList.size() - 1);
        assertThat(testExamen.getDatePrevue()).isEqualTo(DEFAULT_DATE_PREVUE);
        assertThat(testExamen.getDateExamen()).isEqualTo(DEFAULT_DATE_EXAMEN);
        assertThat(testExamen.getEtat()).isEqualTo(DEFAULT_ETAT);
        assertThat(testExamen.getLieuExamen()).isEqualTo(DEFAULT_LIEU_EXAMEN);
        assertThat(testExamen.getMiniDossier()).isEqualTo(DEFAULT_MINI_DOSSIER);
    }

    @Test
    @Transactional
    void createExamenWithExistingId() throws Exception {
        // Create the Examen with an existing ID
        examen.setId(1L);

        int databaseSizeBeforeCreate = examenRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restExamenMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(examen)))
            .andExpect(status().isBadRequest());

        // Validate the Examen in the database
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDatePrevueIsRequired() throws Exception {
        int databaseSizeBeforeTest = examenRepository.findAll().size();
        // set the field null
        examen.setDatePrevue(null);

        // Create the Examen, which fails.

        restExamenMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(examen)))
            .andExpect(status().isBadRequest());

        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateExamenIsRequired() throws Exception {
        int databaseSizeBeforeTest = examenRepository.findAll().size();
        // set the field null
        examen.setDateExamen(null);

        // Create the Examen, which fails.

        restExamenMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(examen)))
            .andExpect(status().isBadRequest());

        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllExamen() throws Exception {
        // Initialize the database
        examenRepository.saveAndFlush(examen);

        // Get all the examenList
        restExamenMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(examen.getId().intValue())))
            .andExpect(jsonPath("$.[*].datePrevue").value(hasItem(DEFAULT_DATE_PREVUE.toString())))
            .andExpect(jsonPath("$.[*].dateExamen").value(hasItem(DEFAULT_DATE_EXAMEN.toString())))
            .andExpect(jsonPath("$.[*].etat").value(hasItem(DEFAULT_ETAT.toString())))
            .andExpect(jsonPath("$.[*].lieuExamen").value(hasItem(DEFAULT_LIEU_EXAMEN)))
            .andExpect(jsonPath("$.[*].miniDossier").value(hasItem(DEFAULT_MINI_DOSSIER)));
    }

    @Test
    @Transactional
    void getExamen() throws Exception {
        // Initialize the database
        examenRepository.saveAndFlush(examen);

        // Get the examen
        restExamenMockMvc
            .perform(get(ENTITY_API_URL_ID, examen.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(examen.getId().intValue()))
            .andExpect(jsonPath("$.datePrevue").value(DEFAULT_DATE_PREVUE.toString()))
            .andExpect(jsonPath("$.dateExamen").value(DEFAULT_DATE_EXAMEN.toString()))
            .andExpect(jsonPath("$.etat").value(DEFAULT_ETAT.toString()))
            .andExpect(jsonPath("$.lieuExamen").value(DEFAULT_LIEU_EXAMEN))
            .andExpect(jsonPath("$.miniDossier").value(DEFAULT_MINI_DOSSIER));
    }

    @Test
    @Transactional
    void getNonExistingExamen() throws Exception {
        // Get the examen
        restExamenMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingExamen() throws Exception {
        // Initialize the database
        examenRepository.saveAndFlush(examen);

        int databaseSizeBeforeUpdate = examenRepository.findAll().size();

        // Update the examen
        Examen updatedExamen = examenRepository.findById(examen.getId()).get();
        // Disconnect from session so that the updates on updatedExamen are not directly saved in db
        em.detach(updatedExamen);
        updatedExamen
            .datePrevue(UPDATED_DATE_PREVUE)
            .dateExamen(UPDATED_DATE_EXAMEN)
            .etat(UPDATED_ETAT)
            .lieuExamen(UPDATED_LIEU_EXAMEN)
            .miniDossier(UPDATED_MINI_DOSSIER);

        restExamenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedExamen.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedExamen))
            )
            .andExpect(status().isOk());

        // Validate the Examen in the database
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeUpdate);
        Examen testExamen = examenList.get(examenList.size() - 1);
        assertThat(testExamen.getDatePrevue()).isEqualTo(UPDATED_DATE_PREVUE);
        assertThat(testExamen.getDateExamen()).isEqualTo(UPDATED_DATE_EXAMEN);
        assertThat(testExamen.getEtat()).isEqualTo(UPDATED_ETAT);
        assertThat(testExamen.getLieuExamen()).isEqualTo(UPDATED_LIEU_EXAMEN);
        assertThat(testExamen.getMiniDossier()).isEqualTo(UPDATED_MINI_DOSSIER);
    }

    @Test
    @Transactional
    void putNonExistingExamen() throws Exception {
        int databaseSizeBeforeUpdate = examenRepository.findAll().size();
        examen.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExamenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, examen.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(examen))
            )
            .andExpect(status().isBadRequest());

        // Validate the Examen in the database
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchExamen() throws Exception {
        int databaseSizeBeforeUpdate = examenRepository.findAll().size();
        examen.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExamenMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(examen))
            )
            .andExpect(status().isBadRequest());

        // Validate the Examen in the database
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamExamen() throws Exception {
        int databaseSizeBeforeUpdate = examenRepository.findAll().size();
        examen.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExamenMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(examen)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Examen in the database
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateExamenWithPatch() throws Exception {
        // Initialize the database
        examenRepository.saveAndFlush(examen);

        int databaseSizeBeforeUpdate = examenRepository.findAll().size();

        // Update the examen using partial update
        Examen partialUpdatedExamen = new Examen();
        partialUpdatedExamen.setId(examen.getId());

        partialUpdatedExamen.dateExamen(UPDATED_DATE_EXAMEN).etat(UPDATED_ETAT).miniDossier(UPDATED_MINI_DOSSIER);

        restExamenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExamen.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExamen))
            )
            .andExpect(status().isOk());

        // Validate the Examen in the database
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeUpdate);
        Examen testExamen = examenList.get(examenList.size() - 1);
        assertThat(testExamen.getDatePrevue()).isEqualTo(DEFAULT_DATE_PREVUE);
        assertThat(testExamen.getDateExamen()).isEqualTo(UPDATED_DATE_EXAMEN);
        assertThat(testExamen.getEtat()).isEqualTo(UPDATED_ETAT);
        assertThat(testExamen.getLieuExamen()).isEqualTo(DEFAULT_LIEU_EXAMEN);
        assertThat(testExamen.getMiniDossier()).isEqualTo(UPDATED_MINI_DOSSIER);
    }

    @Test
    @Transactional
    void fullUpdateExamenWithPatch() throws Exception {
        // Initialize the database
        examenRepository.saveAndFlush(examen);

        int databaseSizeBeforeUpdate = examenRepository.findAll().size();

        // Update the examen using partial update
        Examen partialUpdatedExamen = new Examen();
        partialUpdatedExamen.setId(examen.getId());

        partialUpdatedExamen
            .datePrevue(UPDATED_DATE_PREVUE)
            .dateExamen(UPDATED_DATE_EXAMEN)
            .etat(UPDATED_ETAT)
            .lieuExamen(UPDATED_LIEU_EXAMEN)
            .miniDossier(UPDATED_MINI_DOSSIER);

        restExamenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExamen.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExamen))
            )
            .andExpect(status().isOk());

        // Validate the Examen in the database
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeUpdate);
        Examen testExamen = examenList.get(examenList.size() - 1);
        assertThat(testExamen.getDatePrevue()).isEqualTo(UPDATED_DATE_PREVUE);
        assertThat(testExamen.getDateExamen()).isEqualTo(UPDATED_DATE_EXAMEN);
        assertThat(testExamen.getEtat()).isEqualTo(UPDATED_ETAT);
        assertThat(testExamen.getLieuExamen()).isEqualTo(UPDATED_LIEU_EXAMEN);
        assertThat(testExamen.getMiniDossier()).isEqualTo(UPDATED_MINI_DOSSIER);
    }

    @Test
    @Transactional
    void patchNonExistingExamen() throws Exception {
        int databaseSizeBeforeUpdate = examenRepository.findAll().size();
        examen.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExamenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, examen.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(examen))
            )
            .andExpect(status().isBadRequest());

        // Validate the Examen in the database
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchExamen() throws Exception {
        int databaseSizeBeforeUpdate = examenRepository.findAll().size();
        examen.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExamenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(examen))
            )
            .andExpect(status().isBadRequest());

        // Validate the Examen in the database
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamExamen() throws Exception {
        int databaseSizeBeforeUpdate = examenRepository.findAll().size();
        examen.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExamenMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(examen)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Examen in the database
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteExamen() throws Exception {
        // Initialize the database
        examenRepository.saveAndFlush(examen);

        int databaseSizeBeforeDelete = examenRepository.findAll().size();

        // Delete the examen
        restExamenMockMvc
            .perform(delete(ENTITY_API_URL_ID, examen.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Examen> examenList = examenRepository.findAll();
        assertThat(examenList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
