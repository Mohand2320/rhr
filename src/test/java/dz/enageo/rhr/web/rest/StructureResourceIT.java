package dz.enageo.rhr.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import dz.enageo.rhr.IntegrationTest;
import dz.enageo.rhr.domain.Structure;
import dz.enageo.rhr.repository.StructureRepository;
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
 * Integration tests for the {@link StructureResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StructureResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/structures";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private StructureRepository structureRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStructureMockMvc;

    private Structure structure;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Structure createEntity(EntityManager em) {
        Structure structure = new Structure().nom(DEFAULT_NOM);
        return structure;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Structure createUpdatedEntity(EntityManager em) {
        Structure structure = new Structure().nom(UPDATED_NOM);
        return structure;
    }

    @BeforeEach
    public void initTest() {
        structure = createEntity(em);
    }

    @Test
    @Transactional
    void createStructure() throws Exception {
        int databaseSizeBeforeCreate = structureRepository.findAll().size();
        // Create the Structure
        restStructureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(structure)))
            .andExpect(status().isCreated());

        // Validate the Structure in the database
        List<Structure> structureList = structureRepository.findAll();
        assertThat(structureList).hasSize(databaseSizeBeforeCreate + 1);
        Structure testStructure = structureList.get(structureList.size() - 1);
        assertThat(testStructure.getNom()).isEqualTo(DEFAULT_NOM);
    }

    @Test
    @Transactional
    void createStructureWithExistingId() throws Exception {
        // Create the Structure with an existing ID
        structure.setId(1L);

        int databaseSizeBeforeCreate = structureRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStructureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(structure)))
            .andExpect(status().isBadRequest());

        // Validate the Structure in the database
        List<Structure> structureList = structureRepository.findAll();
        assertThat(structureList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomIsRequired() throws Exception {
        int databaseSizeBeforeTest = structureRepository.findAll().size();
        // set the field null
        structure.setNom(null);

        // Create the Structure, which fails.

        restStructureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(structure)))
            .andExpect(status().isBadRequest());

        List<Structure> structureList = structureRepository.findAll();
        assertThat(structureList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllStructures() throws Exception {
        // Initialize the database
        structureRepository.saveAndFlush(structure);

        // Get all the structureList
        restStructureMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(structure.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)));
    }

    @Test
    @Transactional
    void getStructure() throws Exception {
        // Initialize the database
        structureRepository.saveAndFlush(structure);

        // Get the structure
        restStructureMockMvc
            .perform(get(ENTITY_API_URL_ID, structure.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(structure.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM));
    }

    @Test
    @Transactional
    void getNonExistingStructure() throws Exception {
        // Get the structure
        restStructureMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingStructure() throws Exception {
        // Initialize the database
        structureRepository.saveAndFlush(structure);

        int databaseSizeBeforeUpdate = structureRepository.findAll().size();

        // Update the structure
        Structure updatedStructure = structureRepository.findById(structure.getId()).get();
        // Disconnect from session so that the updates on updatedStructure are not directly saved in db
        em.detach(updatedStructure);
        updatedStructure.nom(UPDATED_NOM);

        restStructureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStructure.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStructure))
            )
            .andExpect(status().isOk());

        // Validate the Structure in the database
        List<Structure> structureList = structureRepository.findAll();
        assertThat(structureList).hasSize(databaseSizeBeforeUpdate);
        Structure testStructure = structureList.get(structureList.size() - 1);
        assertThat(testStructure.getNom()).isEqualTo(UPDATED_NOM);
    }

    @Test
    @Transactional
    void putNonExistingStructure() throws Exception {
        int databaseSizeBeforeUpdate = structureRepository.findAll().size();
        structure.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStructureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, structure.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(structure))
            )
            .andExpect(status().isBadRequest());

        // Validate the Structure in the database
        List<Structure> structureList = structureRepository.findAll();
        assertThat(structureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStructure() throws Exception {
        int databaseSizeBeforeUpdate = structureRepository.findAll().size();
        structure.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStructureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(structure))
            )
            .andExpect(status().isBadRequest());

        // Validate the Structure in the database
        List<Structure> structureList = structureRepository.findAll();
        assertThat(structureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStructure() throws Exception {
        int databaseSizeBeforeUpdate = structureRepository.findAll().size();
        structure.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStructureMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(structure)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Structure in the database
        List<Structure> structureList = structureRepository.findAll();
        assertThat(structureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStructureWithPatch() throws Exception {
        // Initialize the database
        structureRepository.saveAndFlush(structure);

        int databaseSizeBeforeUpdate = structureRepository.findAll().size();

        // Update the structure using partial update
        Structure partialUpdatedStructure = new Structure();
        partialUpdatedStructure.setId(structure.getId());

        restStructureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStructure.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStructure))
            )
            .andExpect(status().isOk());

        // Validate the Structure in the database
        List<Structure> structureList = structureRepository.findAll();
        assertThat(structureList).hasSize(databaseSizeBeforeUpdate);
        Structure testStructure = structureList.get(structureList.size() - 1);
        assertThat(testStructure.getNom()).isEqualTo(DEFAULT_NOM);
    }

    @Test
    @Transactional
    void fullUpdateStructureWithPatch() throws Exception {
        // Initialize the database
        structureRepository.saveAndFlush(structure);

        int databaseSizeBeforeUpdate = structureRepository.findAll().size();

        // Update the structure using partial update
        Structure partialUpdatedStructure = new Structure();
        partialUpdatedStructure.setId(structure.getId());

        partialUpdatedStructure.nom(UPDATED_NOM);

        restStructureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStructure.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStructure))
            )
            .andExpect(status().isOk());

        // Validate the Structure in the database
        List<Structure> structureList = structureRepository.findAll();
        assertThat(structureList).hasSize(databaseSizeBeforeUpdate);
        Structure testStructure = structureList.get(structureList.size() - 1);
        assertThat(testStructure.getNom()).isEqualTo(UPDATED_NOM);
    }

    @Test
    @Transactional
    void patchNonExistingStructure() throws Exception {
        int databaseSizeBeforeUpdate = structureRepository.findAll().size();
        structure.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStructureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, structure.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(structure))
            )
            .andExpect(status().isBadRequest());

        // Validate the Structure in the database
        List<Structure> structureList = structureRepository.findAll();
        assertThat(structureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStructure() throws Exception {
        int databaseSizeBeforeUpdate = structureRepository.findAll().size();
        structure.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStructureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(structure))
            )
            .andExpect(status().isBadRequest());

        // Validate the Structure in the database
        List<Structure> structureList = structureRepository.findAll();
        assertThat(structureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStructure() throws Exception {
        int databaseSizeBeforeUpdate = structureRepository.findAll().size();
        structure.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStructureMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(structure))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Structure in the database
        List<Structure> structureList = structureRepository.findAll();
        assertThat(structureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStructure() throws Exception {
        // Initialize the database
        structureRepository.saveAndFlush(structure);

        int databaseSizeBeforeDelete = structureRepository.findAll().size();

        // Delete the structure
        restStructureMockMvc
            .perform(delete(ENTITY_API_URL_ID, structure.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Structure> structureList = structureRepository.findAll();
        assertThat(structureList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
