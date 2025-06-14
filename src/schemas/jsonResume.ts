
// JSON Resume Schema v1.2.1 validation
export const jsonResumeSchema = {
  type: "object",
  properties: {
    basics: {
      type: "object",
      properties: {
        name: { type: "string" },
        label: { type: "string" },
        image: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        url: { type: "string" },
        summary: { type: "string" },
        location: {
          type: "object",
          properties: {
            address: { type: "string" },
            postalCode: { type: "string" },
            city: { type: "string" },
            countryCode: { type: "string" },
            region: { type: "string" }
          }
        },
        profiles: {
          type: "array",
          items: {
            type: "object",
            properties: {
              network: { type: "string" },
              username: { type: "string" },
              url: { type: "string" }
            }
          }
        }
      }
    },
    work: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          position: { type: "string" },
          url: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          summary: { type: "string" },
          highlights: { type: "array", items: { type: "string" } }
        }
      }
    },
    education: {
      type: "array",
      items: {
        type: "object",
        properties: {
          institution: { type: "string" },
          url: { type: "string" },
          area: { type: "string" },
          studyType: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          score: { type: "string" },
          courses: { type: "array", items: { type: "string" } }
        }
      }
    },
    skills: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          level: { type: "string" },
          keywords: { type: "array", items: { type: "string" } }
        }
      }
    },
    projects: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          highlights: { type: "array", items: { type: "string" } },
          keywords: { type: "array", items: { type: "string" } },
          startDate: { type: "string" },
          endDate: { type: "string" },
          url: { type: "string" },
          roles: { type: "array", items: { type: "string" } },
          entity: { type: "string" },
          type: { type: "string" }
        }
      }
    }
  }
};
