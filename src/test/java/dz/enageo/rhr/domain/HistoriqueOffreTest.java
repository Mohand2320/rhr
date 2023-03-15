package dz.enageo.rhr.domain;

import static org.assertj.core.api.Assertions.assertThat;

import dz.enageo.rhr.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class HistoriqueOffreTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(HistoriqueOffre.class);
        HistoriqueOffre historiqueOffre1 = new HistoriqueOffre();
        historiqueOffre1.setId(1L);
        HistoriqueOffre historiqueOffre2 = new HistoriqueOffre();
        historiqueOffre2.setId(historiqueOffre1.getId());
        assertThat(historiqueOffre1).isEqualTo(historiqueOffre2);
        historiqueOffre2.setId(2L);
        assertThat(historiqueOffre1).isNotEqualTo(historiqueOffre2);
        historiqueOffre1.setId(null);
        assertThat(historiqueOffre1).isNotEqualTo(historiqueOffre2);
    }
}
