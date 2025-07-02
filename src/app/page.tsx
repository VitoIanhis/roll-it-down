"use client";
import React from "react";
import { Card, Button, Typography, Row, Col, Spin } from "antd";
import Image from "next/image";
import styles from "./page.module.css";
import { LuSwords } from "react-icons/lu";
import { FaUserSecret, FaDiceD20, FaBookOpen } from "react-icons/fa";
import { GiOpenTreasureChest, GiTreasureMap } from "react-icons/gi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";

const { Title, Paragraph } = Typography;

const tools = [
  {
    key: "combat-tracker",
    title: "Oráculo do Combate",
    icon: <LuSwords size={48} color="#f5f5dc" style={{ marginBottom: 8 }} />,
    description:
      "Domine batalhas épicas com organização e agilidade. Controle a iniciativa, acompanhe status e mantenha o fluxo do combate como um verdadeiro mestre.",
    button: {
      text: "Acessar",
      href: "/tracker",
      disabled: false,
    },
  },
  {
    key: "npc-generator",
    title: "Forjador de Destinos",
    icon: (
      <FaUserSecret size={44} color="#f5f5dc" style={{ marginBottom: 8 }} />
    ),
    description:
      "Crie personagens únicos em segundos. Personalidades, motivações e segredos prontos para surpreender seus jogadores.",
    button: {
      text: "Em construção",
      href: "#",
      disabled: true,
    },
  },
  {
    key: "dice-roller",
    title: "Dados do Destino",
    icon: <FaDiceD20 size={44} color="#f5f5dc" style={{ marginBottom: 8 }} />,
    description:
      "Role qualquer combinação de dados com efeitos visuais místicos. Sorte ou destino? Descubra com um clique.",
    button: {
      text: "Em construção",
      href: "#",
      disabled: true,
    },
  },
  {
    key: "campaign-manager",
    title: "Grimório de Campanhas",
    icon: <FaBookOpen size={44} color="#f5f5dc" style={{ marginBottom: 8 }} />,
    description:
      "Organize sessões, registre lendas e mantenha o grimório da sua campanha sempre à mão.",
    button: {
      text: "Em construção",
      href: "#",
      disabled: true,
    },
  },
  {
    key: "map-generator",
    title: "Gerador de Mapas",
    icon: (
      <GiTreasureMap size={44} color="#f5f5dc" style={{ marginBottom: 8 }} />
    ),
    description:
      "Crie mapas táticos e cenários de aventura em segundos. Personalize terrenos, adicione marcadores e surpreenda seu grupo com ambientes únicos.",
    button: {
      text: "Em construção",
      href: "#",
      disabled: true,
    },
  },
  {
    key: "loot-randomizer",
    title: "Tesouros do Inesperado",
    icon: (
      <GiOpenTreasureChest
        size={44}
        color="#f5f5dc"
        style={{ marginBottom: 8 }}
      />
    ),
    description:
      "Gere recompensas, itens mágicos e tesouros lendários para suas sessões. Surpreenda os jogadores com prêmios inesperados a cada aventura.",
    button: {
      text: "Em construção",
      href: "#",
      disabled: true,
    },
  },
];

const cardBodyStyle: React.CSSProperties = {
  minHeight: 140,
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
};

const cardButtonStyle: React.CSSProperties = {
  display: "flex",
  margin: "0 auto",
  alignItems: "center",
};

const logoTextStyle: React.CSSProperties = {
  textShadow: "0 2px 4px rgba(28, 43, 74, 0.15)",
  letterSpacing: "0.5px",
};

const heroSectionRowStyle: React.CSSProperties = {
  marginTop: -35,
  marginBottom: 40,
};
const iconWrapperStyle: React.CSSProperties = {
  margin: "16px 0 8px 0",
  display: "flex",
  justifyContent: "center",
  width: "100%",
};
const cardTitleStyle: React.CSSProperties = {
  textAlign: "center" as const,
  marginBottom: 0,
};
const cardDescStyle: React.CSSProperties = {
  textAlign: "center" as const,
  marginBottom: 24,
};

export default function Home() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 9999,
          background: "rgba(28, 43, 74, 0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const settings = {
    centerMode: true,
    centerPadding: "188px",
    slidesToShow: 1,
    infinite: true,
    dots: false,
    arrows: false,
    draggable: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          centerPadding: "6vw",
        },
      },
    ],
  };
  return (
    <>
      <div className={styles.landingBg}>
        <div className={styles.heroSection}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={styles.logoWrapper}
          >
            <Image
              src="/assets/logo.svg"
              alt="Roll It Down Logo"
              width={180}
              height={180}
              priority
              style={{ filter: "drop-shadow(0 2px 4px rgba(28, 43, 74, 0.9))" }}
              className={styles.logo}
            />
            <span
              className="mt-2 text-center text-xs italic font-medium"
              style={logoTextStyle}
            >
              De jogador para jogador. Feito pra quem vive cada sessão.
            </span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className={styles.heroIntro}
          >
            Bem-vindo ao{" "}
            <b>
              <i>grimório de ferramentas místicas</i>
            </b>{" "}
            para RPG! Aqui, mestres e aventureiros encontram{" "}
            <b>
              <i>itens mágicos forjados</i>
            </b>{" "}
            para facilitar campanhas, acelerar batalhas e dar vida a mundos
            fantásticos. Desvende recursos épicos, invoque NPCs, role dados do
            destino e mantenha o controle absoluto da sua mesa. O apoio
            essencial para jornadas lendárias está a um{" "}
            <b>
              <i>clique</i>
            </b>
            !
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.45 }}
        >
          <Row justify="center" style={heroSectionRowStyle}>
            <Col xs={24} sm={22} md={20} lg={16} xl={12}>
              <div className={styles.carouselWrapper}>
                <Slider {...settings} className={styles.carousel}>
                  {tools.map(({ key, title, icon, description, button }) => (
                    <div key={key} className={styles.carouselItem}>
                      <Card
                        bordered={false}
                        className={styles.toolCard}
                        bodyStyle={cardBodyStyle}
                      >
                        <Title
                          level={4}
                          className={styles.cardTitle}
                          style={cardTitleStyle}
                        >
                          {title}
                        </Title>
                        <div style={iconWrapperStyle}>{icon}</div>
                        <Paragraph
                          className={styles.cardDesc}
                          style={cardDescStyle}
                        >
                          {description}
                        </Paragraph>
                        <Button
                          type="primary"
                          href={button.href}
                          disabled={button.disabled}
                          className={styles.cardButton}
                          size="large"
                          style={cardButtonStyle}
                        >
                          {button.text}
                        </Button>
                      </Card>
                    </div>
                  ))}
                </Slider>
              </div>
            </Col>
          </Row>
        </motion.div>
      </div>
      <footer className={styles.footer}>
        <span>
          © {new Date().getFullYear()} Roll It Down. Feito por jogadores para
          jogadores.
        </span>
      </footer>
    </>
  );
}
