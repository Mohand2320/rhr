package dz.enageo.rhr.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import dz.enageo.rhr.IntegrationTest;
import dz.enageo.rhr.domain.Personne;
import dz.enageo.rhr.repository.PersonneRepository;
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
 * Integration tests for the {@link PersonneResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PersonneResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_PRENOM = "AAAAAAAAAA";
    private static final String UPDATED_PRENOM = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE_NAISSANCE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_NAISSANCE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_TEL = "0135136805";
    private static final String UPDATED_TEL = "02104101665";

    private static final String DEFAULT_NUMERO_INSCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO_INSCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE_ORIENTATION = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_ORIENTATION = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/personnes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PersonneRepository personneRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPersonneMockMvc;

    private Personne personne;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Personne createEntity(EntityManager em) {
        Personne personne = new Personne()
            .nom(DEFAULT_NOM)
            .prenom(DEFAULT_PRENOM)
            .dateNaissance(DEFAULT_DATE_NAISSANCE)
            .tel(DEFAULT_TEL)
            .numeroInscription(DEFAULT_NUMERO_INSCRIPTION)
            .dateOrientation(DEFAULT_DATE_ORIENTATION);
        return personne;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Personne createUpdatedEntity(EntityManager em) {
        Personne personne = new Personne()
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .dateNaissance(UPDATED_DATE_NAISSANCE)
            .tel(UPDATED_TEL)
            .numeroInscription(UPDATED_NUMERO_INSCRIPTION)
            .dateOrientation(UPDATED_DATE_ORIENTATION);
        return personne;
    }

    @BeforeEach
    public void initTest() {
        personne = createEntity(em);
    }

    @Test
    @Transactional
    void createPersonne() throws Exception {
        int databaseSizeBeforeCreate = personneRepository.findAll().size();
        // Create the Personne
        restPersonneMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(personne)))
            .andExpect(status().isCreated());

        // Validate the Personne in the database
        List<Personne> personneList = personneRepository.findAll();
        assertThat(personneList).hasSize(databaseSizeBeforeCreate + 1);
        Personne testPersonne = personneList.get(personneList.size() - 1);
        assertThat(testPersonne.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testPersonne.getPrenom()).isEqualTo(DEFAULT_PRENOM);
        assertThat(testPersonne.getDateNaissance()).isEqualTo(DEFAULT_DATE_NAISSANCE);
        assertThat(testPersonne.getTel()).isEqualTo(DEFAULT_TEL);
        assertThat(testPersonne.getNumeroInscription()).isEqualTo(DEFAULT_NUMERO_INSCRIPTION);
        assertThat(testPersonne.getDateOrientation()).isEqualTo(DEFAULT_DATE_ORIENTATION);
    }

    @Test
    @Transactional
    void createPersonneWithExistingId() throws Exception {
        // Create the Personne with an existing ID
        personne.setId(1L);

        int databaseSizeBeforeCreate = personneRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPersonneMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(personne)))
            .andExpect(status().isBadRequest());

        // Validate the Personne in the database
        List<Personne> personneList = personneRepository.findAll();
        assertThat(personneList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomIsRequired() throws Exception {
        int databaseSizeBeforeTest = personneRepository.findAll().size();
        // set the field null
        personne.setNom(null);

        // Create the Personne, which fails.

        restPersonneMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(personne)))
            .andExpect(status().isBadRequest());

        List<Personne> personneList = personneRepository.findAll();
        assertThat(personneList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPrenomIsRequired() throws Exception {
        int databaseSizeBeforeTest = personneRepository.findAll().size();
        // set the field null
        personne.setPrenom(null);

        // Create the Personne, which fails.

        restPersonneMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(personne)))
            .andExpect(status().isBadRequest());

        List<Personne> personneList = personneRepository.findAll();
        assertThat(personneList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateNaissanceIsRequired() throws Exception {
        int databaseSizeBeforeTest = personneRepository.findAll().size();
        // set the field null
        personne.setDateNaissance(null);

        // Create the Personne, which fails.

        restPersonneMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(personne)))
            .andExpect(status().isBadRequest());

        List<Personne> personneList = personneRepository.findAll();
        assertThat(personneList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPersonnes() throws Exception {
        // Initialize the database
        personneRepository.saveAndFlush(personne);

        // Get all the personneList
        restPersonneMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(personne.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].prenom").value(hasItem(DEFAULT_PRENOM)))
            .andExpect(jsonPath("$.[*].dateNaissance").value(hasItem(DEFAULT_DATE_NAISSANCE.toString())))
            .andExpect(jsonPath("$.[*].tel").value(hasItem(DEFAULT_TEL)))
            .andExpect(jsonPath("$.[*].numeroInscription").value(hasItem(DEFAULT_NUMERO_INSCRIPTION)))
            .andExpect(jsonPath("$.[*].dateOrientation").value(hasItem(DEFAULT_DATE_ORIENTATION.toString())));
    }

    @Test
    @Transactional
    void getPersonne() throws Exception {
        // Initialize the database
        personneRepository.saveAndFlush(personne);

        // Get the personne
        restPersonneMockMvc
            .perform(get(ENTITY_API_URL_ID, personne.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(personne.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.prenom").value(DEFAULT_PRENOM))
            .andExpect(jsonPath("$.dateNaissance").value(DEFAULT_DATE_NAISSANCE.toString()))
            .andExpect(jsonPath("$.tel").value(DEFAULT_TEL))
            .andExpect(jsonPath("$.numeroInscription").value(DEFAULT_NUMERO_INSCRIPTION))
            .andExpect(jsonPath("$.dateOrientation").value(DEFAULT_DATE_ORIENTATION.toString()));
    }

    @Test
    @Transactional
    void getNonExistingPersonne() throws Exception {
        // Get the personne
        restPersonneMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPersonne() throws Exception {
        // Initialize the database
        personneRepository.saveAndFlush(personne);

        int databaseSizeBeforeUpdate = personneRepository.findAll().size();

        // Update the personne
        Personne updatedPersonne = personneRepository.findById(personne.getId()).get();
        // Disconnect from session so that the updates on updatedPersonne are not directly saved in db
        em.detach(updatedPersonne);
        updatedPersonne
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .dateNaissance(UPDATED_DATE_NAISSANCE)
            .tel(UPDATED_TEL)
            .numeroInscription(UPDATED_NUMERO_INSCRIPTION)
            .dateOrientation(UPDATED_DATE_ORIENTATION);

        restPersonneMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPersonne.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPersonne))
            )
            .andExpect(status().isOk());

        // Validate the Personne in the database
        List<Personne> personneList = personneRepository.findAll();
        assertThat(personneList).hasSize(databaseSizeBeforeUpdate);
        Personne testPersonne = personneList.get(personneList.size() - 1);
        assertThat(testPersonne.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testPersonne.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testPersonne.getDateNaissance()).isEqualTo(UPDATED_DATE_NAISSANCE);
        assertThat(testPersonne.getTel()).isEqualTo(UPDATED_TEL);
        assertThat(testPersonne.getNumeroInscription()).isEqualTo(UPDATED_NUMERO_INSCRIPTION);
        assertThat(testPersonne.getDateOrientation()).isEqualTo(UPDATED_DATE_ORIENTATION);
    }

    @Test
    @Transactional
    void putNonExistingPersonne() throws Exception {
        int databaseSizeBeforeUpdate = personneRepository.findAll().size();
        personne.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPersonneMockMvc
            .perform(
                put(ENTITY_API_URL_ID, personne.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(personne))
            )
            .andExpect(status().isBadRequest());

        // Validate the Personne in the database
        List<Personne> personneList = personneRepository.findAll();
        assertThat(personneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPersonne() throws Exception {
        int databaseSizeBeforeUpdate = personneRepository.findAll().size();
        personne.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonneMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(personne))
            )
            .andExpect(status().isBadRequest());

        // Validate the Personne in the database
        List<Personne> personneList = personneRepository.findAll();
        assertThat(personneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPersonne() throws Exception {
        int databaseSizeBeforeUpdate = personneRepository.findAll().size();
        personne.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonneMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(personne)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Personne in the database
        List<Personne> personneList = personneRepository.findAll();
        assertThat(personneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePersonneWithPatch() throws Exception {
        // Initialize the database
        personneRepository.saveAndFlush(personne);

        int databaseSizeBeforeUpdate = personneRepository.findAll().size();

        // Update the personne using partial update
        Personne partialUpdatedPersonne = new Personne();
        partialUpdatedPersonne.setId(personne.getId());

        partialUpdatedPersonne.nom(UPDATED_NOM).prenom(UPDATED_PRENOM).tel(UPDATED_TEL).numeroInscription(UPDATED_NUMERO_INSCRIPTION);

        restPersonneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPersonne.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPersonne))
            )
            .andExpect(status().isOk());

        // Validate the Personne in the database
        List<Personne> personneList = personneRepository.findAll();
        assertThat(personneList).hasSize(databaseSizeBeforeUpdate);
        Personne testPersonne = personneList.get(personneList.size() - 1);
        assertThat(testPersonne.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testPersonne.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testPersonne.getDateNaissance()).isEqualTo(DEFAULT_DATE_NAISSANCE);
        assertThat(testPersonne.getTel()).isEqualTo(UPDATED_TEL);
        assertThat(testPersonne.getNumeroInscription()).isEqualTo(UPDATED_NUMERO_INSCRIPTION);
        assertThat(testPersonne.getDateOrientation()).isEqualTo(DEFAULT_DATE_ORIENTATION);
    }

    @Test
    @Transactional
    void fullUpdatePersonneWithPatch() throws Exception {
        // Initialize the database
        personneRepository.saveAndFlush(personne);

        int databaseSizeBeforeUpdate = personneRepository.findAll().size();

        // Update the personne using partial update
        Personne partialUpdatedPersonne = new Personne();
        partialUpdatedPersonne.setId(personne.getId());

        partialUpdatedPersonne
            .nom(UPDATED_NOM)
            .prenom(UPDATED_PRENOM)
            .dateNaissance(UPDATED_DATE_NAISSANCE)
            .tel(UPDATED_TEL)
            .numeroInscription(UPDATED_NUMERO_INSCRIPTION)
            .dateOrientation(UPDATED_DATE_ORIENTATION);

        restPersonneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPersonne.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPersonne))
            )
            .andExpect(status().isOk());

        // Validate the Personne in the database
        List<Personne> personneList = personneRepository.findAll();
        assertThat(personneList).hasSize(databaseSizeBeforeUpdate);
        Personne testPersonne = personneList.get(personneList.size() - 1);
        assertThat(testPersonne.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testPersonne.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testPersonne.getDateNaissance()).isEqualTo(UPDATED_DATE_NAISSANCE);
        assertThat(testPersonne.getTel()).isEqualTo(UPDATED_TEL);
        assertThat(testPersonne.getNumeroInscription()).isEqualTo(UPDATED_NUMERO_INSCRIPTION);
        assertThat(testPersonne.getDateOrientation()).isEqualTo(UPDATED_DATE_ORIENTATION);
    }

    @Test
    @Transactional
    void patchNonExistingPersonne() throws Exception {
        int databaseSizeBeforeUpdate = personneRepository.findAll().size();
        personne.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPersonneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, personne.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(personne))
            )
            .andExpect(status().isBadRequest());

        // Validate the Personne in the database
        List<Personne> personneList = personneRepository.findAll();
        assertThat(personneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPersonne() throws Exception {
        int databaseSizeBeforeUpdate = personneRepository.findAll().size();
        personne.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(personne))
            )
            .andExpect(status().isBadRequest());

        // Validate the Personne in the database
        List<Personne> personneList = personneRepository.findAll();
        assertThat(personneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPersonne() throws Exception {
        int databaseSizeBeforeUpdate = personneRepository.findAll().size();
        personne.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonneMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(personne)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Personne in the database
        List<Personne> personneList = personneRepository.findAll();
        assertThat(personneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePersonne() throws Exception {
        // Initialize the database
        personneRepository.saveAndFlush(personne);

        int databaseSizeBeforeDelete = personneRepository.findAll().size();

        // Delete the personne
        restPersonneMockMvc
            .perform(delete(ENTITY_API_URL_ID, personne.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Personne> personneList = personneRepository.findAll();
        assertThat(personneList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
