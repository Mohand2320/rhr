package dz.enageo.rhr.domain;

import static org.assertj.core.api.Assertions.assertThat;

import dz.enageo.rhr.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OffrePosteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OffrePoste.class);
        OffrePoste offrePoste1 = new OffrePoste();
        offrePoste1.setId(1L);
        OffrePoste offrePoste2 = new OffrePoste();
        offrePoste2.setId(offrePoste1.getId());
        assertThat(offrePoste1).isEqualTo(offrePoste2);
        offrePoste2.setId(2L);
        assertThat(offrePoste1).isNotEqualTo(offrePoste2);
        offrePoste1.setId(null);
        assertThat(offrePoste1).isNotEqualTo(offrePoste2);
    }
}
