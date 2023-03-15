package dz.enageo.rhr.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import dz.enageo.rhr.IntegrationTest;
import dz.enageo.rhr.domain.Poste;
import dz.enageo.rhr.domain.enumeration.TypePoste;
import dz.enageo.rhr.repository.PosteRepository;
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
 * Integration tests for the {@link PosteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PosteResourceIT {

    private static final String DEFAULT_NOM_POSTE = "AAAAAAAAAA";
    private static final String UPDATED_NOM_POSTE = "BBBBBBBBBB";

    private static final String DEFAULT_NUMERO_POSTE = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO_POSTE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_DIPONIBLE = false;
    private static final Boolean UPDATED_DIPONIBLE = true;

    private static final TypePoste DEFAULT_TYPE_POSTE = TypePoste.TYPEPOSTE1;
    private static final TypePoste UPDATED_TYPE_POSTE = TypePoste.TYPEPOSTE2;

    private static final String ENTITY_API_URL = "/api/postes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PosteRepository posteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPosteMockMvc;

    private Poste poste;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Poste createEntity(EntityManager em) {
        Poste poste = new Poste()
            .nomPoste(DEFAULT_NOM_POSTE)
            .numeroPoste(DEFAULT_NUMERO_POSTE)
            .diponible(DEFAULT_DIPONIBLE)
            .typePoste(DEFAULT_TYPE_POSTE);
        return poste;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Poste createUpdatedEntity(EntityManager em) {
        Poste poste = new Poste()
            .nomPoste(UPDATED_NOM_POSTE)
            .numeroPoste(UPDATED_NUMERO_POSTE)
            .diponible(UPDATED_DIPONIBLE)
            .typePoste(UPDATED_TYPE_POSTE);
        return poste;
    }

    @BeforeEach
    public void initTest() {
        poste = createEntity(em);
    }

    @Test
    @Transactional
    void createPoste() throws Exception {
        int databaseSizeBeforeCreate = posteRepository.findAll().size();
        // Create the Poste
        restPosteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(poste)))
            .andExpect(status().isCreated());

        // Validate the Poste in the database
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeCreate + 1);
        Poste testPoste = posteList.get(posteList.size() - 1);
        assertThat(testPoste.getNomPoste()).isEqualTo(DEFAULT_NOM_POSTE);
        assertThat(testPoste.getNumeroPoste()).isEqualTo(DEFAULT_NUMERO_POSTE);
        assertThat(testPoste.getDiponible()).isEqualTo(DEFAULT_DIPONIBLE);
        assertThat(testPoste.getTypePoste()).isEqualTo(DEFAULT_TYPE_POSTE);
    }

    @Test
    @Transactional
    void createPosteWithExistingId() throws Exception {
        // Create the Poste with an existing ID
        poste.setId(1L);

        int databaseSizeBeforeCreate = posteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPosteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(poste)))
            .andExpect(status().isBadRequest());

        // Validate the Poste in the database
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomPosteIsRequired() throws Exception {
        int databaseSizeBeforeTest = posteRepository.findAll().size();
        // set the field null
        poste.setNomPoste(null);

        // Create the Poste, which fails.

        restPosteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(poste)))
            .andExpect(status().isBadRequest());

        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPostes() throws Exception {
        // Initialize the database
        posteRepository.saveAndFlush(poste);

        // Get all the posteList
        restPosteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(poste.getId().intValue())))
            .andExpect(jsonPath("$.[*].nomPoste").value(hasItem(DEFAULT_NOM_POSTE)))
            .andExpect(jsonPath("$.[*].numeroPoste").value(hasItem(DEFAULT_NUMERO_POSTE)))
            .andExpect(jsonPath("$.[*].diponible").value(hasItem(DEFAULT_DIPONIBLE.booleanValue())))
            .andExpect(jsonPath("$.[*].typePoste").value(hasItem(DEFAULT_TYPE_POSTE.toString())));
    }

    @Test
    @Transactional
    void getPoste() throws Exception {
        // Initialize the database
        posteRepository.saveAndFlush(poste);

        // Get the poste
        restPosteMockMvc
            .perform(get(ENTITY_API_URL_ID, poste.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(poste.getId().intValue()))
            .andExpect(jsonPath("$.nomPoste").value(DEFAULT_NOM_POSTE))
            .andExpect(jsonPath("$.numeroPoste").value(DEFAULT_NUMERO_POSTE))
            .andExpect(jsonPath("$.diponible").value(DEFAULT_DIPONIBLE.booleanValue()))
            .andExpect(jsonPath("$.typePoste").value(DEFAULT_TYPE_POSTE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingPoste() throws Exception {
        // Get the poste
        restPosteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPoste() throws Exception {
        // Initialize the database
        posteRepository.saveAndFlush(poste);

        int databaseSizeBeforeUpdate = posteRepository.findAll().size();

        // Update the poste
        Poste updatedPoste = posteRepository.findById(poste.getId()).get();
        // Disconnect from session so that the updates on updatedPoste are not directly saved in db
        em.detach(updatedPoste);
        updatedPoste
            .nomPoste(UPDATED_NOM_POSTE)
            .numeroPoste(UPDATED_NUMERO_POSTE)
            .diponible(UPDATED_DIPONIBLE)
            .typePoste(UPDATED_TYPE_POSTE);

        restPosteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPoste.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPoste))
            )
            .andExpect(status().isOk());

        // Validate the Poste in the database
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeUpdate);
        Poste testPoste = posteList.get(posteList.size() - 1);
        assertThat(testPoste.getNomPoste()).isEqualTo(UPDATED_NOM_POSTE);
        assertThat(testPoste.getNumeroPoste()).isEqualTo(UPDATED_NUMERO_POSTE);
        assertThat(testPoste.getDiponible()).isEqualTo(UPDATED_DIPONIBLE);
        assertThat(testPoste.getTypePoste()).isEqualTo(UPDATED_TYPE_POSTE);
    }

    @Test
    @Transactional
    void putNonExistingPoste() throws Exception {
        int databaseSizeBeforeUpdate = posteRepository.findAll().size();
        poste.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPosteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, poste.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(poste))
            )
            .andExpect(status().isBadRequest());

        // Validate the Poste in the database
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPoste() throws Exception {
        int databaseSizeBeforeUpdate = posteRepository.findAll().size();
        poste.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPosteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(poste))
            )
            .andExpect(status().isBadRequest());

        // Validate the Poste in the database
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPoste() throws Exception {
        int databaseSizeBeforeUpdate = posteRepository.findAll().size();
        poste.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPosteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(poste)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Poste in the database
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePosteWithPatch() throws Exception {
        // Initialize the database
        posteRepository.saveAndFlush(poste);

        int databaseSizeBeforeUpdate = posteRepository.findAll().size();

        // Update the poste using partial update
        Poste partialUpdatedPoste = new Poste();
        partialUpdatedPoste.setId(poste.getId());

        partialUpdatedPoste.nomPoste(UPDATED_NOM_POSTE).diponible(UPDATED_DIPONIBLE);

        restPosteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPoste.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPoste))
            )
            .andExpect(status().isOk());

        // Validate the Poste in the database
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeUpdate);
        Poste testPoste = posteList.get(posteList.size() - 1);
        assertThat(testPoste.getNomPoste()).isEqualTo(UPDATED_NOM_POSTE);
        assertThat(testPoste.getNumeroPoste()).isEqualTo(DEFAULT_NUMERO_POSTE);
        assertThat(testPoste.getDiponible()).isEqualTo(UPDATED_DIPONIBLE);
        assertThat(testPoste.getTypePoste()).isEqualTo(DEFAULT_TYPE_POSTE);
    }

    @Test
    @Transactional
    void fullUpdatePosteWithPatch() throws Exception {
        // Initialize the database
        posteRepository.saveAndFlush(poste);

        int databaseSizeBeforeUpdate = posteRepository.findAll().size();

        // Update the poste using partial update
        Poste partialUpdatedPoste = new Poste();
        partialUpdatedPoste.setId(poste.getId());

        partialUpdatedPoste
            .nomPoste(UPDATED_NOM_POSTE)
            .numeroPoste(UPDATED_NUMERO_POSTE)
            .diponible(UPDATED_DIPONIBLE)
            .typePoste(UPDATED_TYPE_POSTE);

        restPosteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPoste.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPoste))
            )
            .andExpect(status().isOk());

        // Validate the Poste in the database
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeUpdate);
        Poste testPoste = posteList.get(posteList.size() - 1);
        assertThat(testPoste.getNomPoste()).isEqualTo(UPDATED_NOM_POSTE);
        assertThat(testPoste.getNumeroPoste()).isEqualTo(UPDATED_NUMERO_POSTE);
        assertThat(testPoste.getDiponible()).isEqualTo(UPDATED_DIPONIBLE);
        assertThat(testPoste.getTypePoste()).isEqualTo(UPDATED_TYPE_POSTE);
    }

    @Test
    @Transactional
    void patchNonExistingPoste() throws Exception {
        int databaseSizeBeforeUpdate = posteRepository.findAll().size();
        poste.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPosteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, poste.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(poste))
            )
            .andExpect(status().isBadRequest());

        // Validate the Poste in the database
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPoste() throws Exception {
        int databaseSizeBeforeUpdate = posteRepository.findAll().size();
        poste.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPosteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(poste))
            )
            .andExpect(status().isBadRequest());

        // Validate the Poste in the database
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPoste() throws Exception {
        int databaseSizeBeforeUpdate = posteRepository.findAll().size();
        poste.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPosteMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(poste)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Poste in the database
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePoste() throws Exception {
        // Initialize the database
        posteRepository.saveAndFlush(poste);

        int databaseSizeBeforeDelete = posteRepository.findAll().size();

        // Delete the poste
        restPosteMockMvc
            .perform(delete(ENTITY_API_URL_ID, poste.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Poste> posteList = posteRepository.findAll();
        assertThat(posteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
