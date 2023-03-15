package dz.enageo.rhr.domain;

import static org.assertj.core.api.Assertions.assertThat;

import dz.enageo.rhr.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PrevisionPosteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PrevisionPoste.class);
        PrevisionPoste previsionPoste1 = new PrevisionPoste();
        previsionPoste1.setId(1L);
        PrevisionPoste previsionPoste2 = new PrevisionPoste();
        previsionPoste2.setId(previsionPoste1.getId());
        assertThat(previsionPoste1).isEqualTo(previsionPoste2);
        previsionPoste2.setId(2L);
        assertThat(previsionPoste1).isNotEqualTo(previsionPoste2);
        previsionPoste1.setId(null);
        assertThat(previsionPoste1).isNotEqualTo(previsionPoste2);
    }
}
