package dz.enageo.rhr.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import dz.enageo.rhr.IntegrationTest;
import dz.enageo.rhr.domain.Accord;
import dz.enageo.rhr.repository.AccordRepository;
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
 * Integration tests for the {@link AccordResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AccordResourceIT {

    private static final String DEFAULT_VALIDATEUR = "AAAAAAAAAA";
    private static final String UPDATED_VALIDATEUR = "BBBBBBBBBB";

    private static final String DEFAULT_NUMERO_ACCORD = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO_ACCORD = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE_ARRIVEE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_ARRIVEE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/accords";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AccordRepository accordRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAccordMockMvc;

    private Accord accord;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Accord createEntity(EntityManager em) {
        Accord accord = new Accord().validateur(DEFAULT_VALIDATEUR).numeroAccord(DEFAULT_NUMERO_ACCORD).dateArrivee(DEFAULT_DATE_ARRIVEE);
        return accord;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Accord createUpdatedEntity(EntityManager em) {
        Accord accord = new Accord().validateur(UPDATED_VALIDATEUR).numeroAccord(UPDATED_NUMERO_ACCORD).dateArrivee(UPDATED_DATE_ARRIVEE);
        return accord;
    }

    @BeforeEach
    public void initTest() {
        accord = createEntity(em);
    }

    @Test
    @Transactional
    void createAccord() throws Exception {
        int databaseSizeBeforeCreate = accordRepository.findAll().size();
        // Create the Accord
        restAccordMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accord)))
            .andExpect(status().isCreated());

        // Validate the Accord in the database
        List<Accord> accordList = accordRepository.findAll();
        assertThat(accordList).hasSize(databaseSizeBeforeCreate + 1);
        Accord testAccord = accordList.get(accordList.size() - 1);
        assertThat(testAccord.getValidateur()).isEqualTo(DEFAULT_VALIDATEUR);
        assertThat(testAccord.getNumeroAccord()).isEqualTo(DEFAULT_NUMERO_ACCORD);
        assertThat(testAccord.getDateArrivee()).isEqualTo(DEFAULT_DATE_ARRIVEE);
    }

    @Test
    @Transactional
    void createAccordWithExistingId() throws Exception {
        // Create the Accord with an existing ID
        accord.setId(1L);

        int databaseSizeBeforeCreate = accordRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAccordMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accord)))
            .andExpect(status().isBadRequest());

        // Validate the Accord in the database
        List<Accord> accordList = accordRepository.findAll();
        assertThat(accordList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkValidateurIsRequired() throws Exception {
        int databaseSizeBeforeTest = accordRepository.findAll().size();
        // set the field null
        accord.setValidateur(null);

        // Create the Accord, which fails.

        restAccordMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accord)))
            .andExpect(status().isBadRequest());

        List<Accord> accordList = accordRepository.findAll();
        assertThat(accordList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNumeroAccordIsRequired() throws Exception {
        int databaseSizeBeforeTest = accordRepository.findAll().size();
        // set the field null
        accord.setNumeroAccord(null);

        // Create the Accord, which fails.

        restAccordMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accord)))
            .andExpect(status().isBadRequest());

        List<Accord> accordList = accordRepository.findAll();
        assertThat(accordList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAccords() throws Exception {
        // Initialize the database
        accordRepository.saveAndFlush(accord);

        // Get all the accordList
        restAccordMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(accord.getId().intValue())))
            .andExpect(jsonPath("$.[*].validateur").value(hasItem(DEFAULT_VALIDATEUR)))
            .andExpect(jsonPath("$.[*].numeroAccord").value(hasItem(DEFAULT_NUMERO_ACCORD)))
            .andExpect(jsonPath("$.[*].dateArrivee").value(hasItem(DEFAULT_DATE_ARRIVEE.toString())));
    }

    @Test
    @Transactional
    void getAccord() throws Exception {
        // Initialize the database
        accordRepository.saveAndFlush(accord);

        // Get the accord
        restAccordMockMvc
            .perform(get(ENTITY_API_URL_ID, accord.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(accord.getId().intValue()))
            .andExpect(jsonPath("$.validateur").value(DEFAULT_VALIDATEUR))
            .andExpect(jsonPath("$.numeroAccord").value(DEFAULT_NUMERO_ACCORD))
            .andExpect(jsonPath("$.dateArrivee").value(DEFAULT_DATE_ARRIVEE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAccord() throws Exception {
        // Get the accord
        restAccordMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAccord() throws Exception {
        // Initialize the database
        accordRepository.saveAndFlush(accord);

        int databaseSizeBeforeUpdate = accordRepository.findAll().size();

        // Update the accord
        Accord updatedAccord = accordRepository.findById(accord.getId()).get();
        // Disconnect from session so that the updates on updatedAccord are not directly saved in db
        em.detach(updatedAccord);
        updatedAccord.validateur(UPDATED_VALIDATEUR).numeroAccord(UPDATED_NUMERO_ACCORD).dateArrivee(UPDATED_DATE_ARRIVEE);

        restAccordMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAccord.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAccord))
            )
            .andExpect(status().isOk());

        // Validate the Accord in the database
        List<Accord> accordList = accordRepository.findAll();
        assertThat(accordList).hasSize(databaseSizeBeforeUpdate);
        Accord testAccord = accordList.get(accordList.size() - 1);
        assertThat(testAccord.getValidateur()).isEqualTo(UPDATED_VALIDATEUR);
        assertThat(testAccord.getNumeroAccord()).isEqualTo(UPDATED_NUMERO_ACCORD);
        assertThat(testAccord.getDateArrivee()).isEqualTo(UPDATED_DATE_ARRIVEE);
    }

    @Test
    @Transactional
    void putNonExistingAccord() throws Exception {
        int databaseSizeBeforeUpdate = accordRepository.findAll().size();
        accord.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccordMockMvc
            .perform(
                put(ENTITY_API_URL_ID, accord.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accord))
            )
            .andExpect(status().isBadRequest());

        // Validate the Accord in the database
        List<Accord> accordList = accordRepository.findAll();
        assertThat(accordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAccord() throws Exception {
        int databaseSizeBeforeUpdate = accordRepository.findAll().size();
        accord.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccordMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(accord))
            )
            .andExpect(status().isBadRequest());

        // Validate the Accord in the database
        List<Accord> accordList = accordRepository.findAll();
        assertThat(accordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAccord() throws Exception {
        int databaseSizeBeforeUpdate = accordRepository.findAll().size();
        accord.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccordMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(accord)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Accord in the database
        List<Accord> accordList = accordRepository.findAll();
        assertThat(accordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAccordWithPatch() throws Exception {
        // Initialize the database
        accordRepository.saveAndFlush(accord);

        int databaseSizeBeforeUpdate = accordRepository.findAll().size();

        // Update the accord using partial update
        Accord partialUpdatedAccord = new Accord();
        partialUpdatedAccord.setId(accord.getId());

        partialUpdatedAccord.validateur(UPDATED_VALIDATEUR).numeroAccord(UPDATED_NUMERO_ACCORD).dateArrivee(UPDATED_DATE_ARRIVEE);

        restAccordMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccord.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAccord))
            )
            .andExpect(status().isOk());

        // Validate the Accord in the database
        List<Accord> accordList = accordRepository.findAll();
        assertThat(accordList).hasSize(databaseSizeBeforeUpdate);
        Accord testAccord = accordList.get(accordList.size() - 1);
        assertThat(testAccord.getValidateur()).isEqualTo(UPDATED_VALIDATEUR);
        assertThat(testAccord.getNumeroAccord()).isEqualTo(UPDATED_NUMERO_ACCORD);
        assertThat(testAccord.getDateArrivee()).isEqualTo(UPDATED_DATE_ARRIVEE);
    }

    @Test
    @Transactional
    void fullUpdateAccordWithPatch() throws Exception {
        // Initialize the database
        accordRepository.saveAndFlush(accord);

        int databaseSizeBeforeUpdate = accordRepository.findAll().size();

        // Update the accord using partial update
        Accord partialUpdatedAccord = new Accord();
        partialUpdatedAccord.setId(accord.getId());

        partialUpdatedAccord.validateur(UPDATED_VALIDATEUR).numeroAccord(UPDATED_NUMERO_ACCORD).dateArrivee(UPDATED_DATE_ARRIVEE);

        restAccordMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAccord.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAccord))
            )
            .andExpect(status().isOk());

        // Validate the Accord in the database
        List<Accord> accordList = accordRepository.findAll();
        assertThat(accordList).hasSize(databaseSizeBeforeUpdate);
        Accord testAccord = accordList.get(accordList.size() - 1);
        assertThat(testAccord.getValidateur()).isEqualTo(UPDATED_VALIDATEUR);
        assertThat(testAccord.getNumeroAccord()).isEqualTo(UPDATED_NUMERO_ACCORD);
        assertThat(testAccord.getDateArrivee()).isEqualTo(UPDATED_DATE_ARRIVEE);
    }

    @Test
    @Transactional
    void patchNonExistingAccord() throws Exception {
        int databaseSizeBeforeUpdate = accordRepository.findAll().size();
        accord.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAccordMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, accord.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accord))
            )
            .andExpect(status().isBadRequest());

        // Validate the Accord in the database
        List<Accord> accordList = accordRepository.findAll();
        assertThat(accordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAccord() throws Exception {
        int databaseSizeBeforeUpdate = accordRepository.findAll().size();
        accord.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccordMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(accord))
            )
            .andExpect(status().isBadRequest());

        // Validate the Accord in the database
        List<Accord> accordList = accordRepository.findAll();
        assertThat(accordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAccord() throws Exception {
        int databaseSizeBeforeUpdate = accordRepository.findAll().size();
        accord.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAccordMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(accord)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Accord in the database
        List<Accord> accordList = accordRepository.findAll();
        assertThat(accordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAccord() throws Exception {
        // Initialize the database
        accordRepository.saveAndFlush(accord);

        int databaseSizeBeforeDelete = accordRepository.findAll().size();

        // Delete the accord
        restAccordMockMvc
            .perform(delete(ENTITY_API_URL_ID, accord.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Accord> accordList = accordRepository.findAll();
        assertThat(accordList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
