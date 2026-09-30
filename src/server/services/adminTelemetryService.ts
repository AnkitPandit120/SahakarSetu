import { MissingRagQueryNotification } from '../../types/admin';

// In-memory persistent telemetry store for missing RAG queries & admin metrics
class AdminTelemetryStore {
  private notifications: MissingRagQueryNotification[] = [];
  private totalQueriesCount = 0;
  private ragHitsCount = 0;
  private webFallbacksCount = 0;

  constructor() {
    // Seed initial realistic government knowledge gap notifications for administration
    this.seedInitialNotifications();
  }

  private seedInitialNotifications() {
    this.notifications = [
      {
        id: 'notif-seed-1',
        query: 'What are the motor vehicle laws and transport fitness rules for rural agricultural tractors in cooperative society transport?',
        language: 'en',
        category: 'Vehicle & Transport',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        fallbackSourceType: 'web',
        status: 'pending',
        suggestedAction: 'Upload Central Motor Vehicles Rules / State Transport Exemption circular for PACS tractors to Google Drive.',
        webSourcesFound: [
          { title: 'Ministry of Road Transport and Highways (MoRTH)', officialUrl: 'https://morth.nic.in' },
          { title: 'Central Motor Vehicles Act 1988 Gazette', officialUrl: 'https://egazette.gov.in' }
        ]
      },
      {
        id: 'notif-seed-2',
        query: 'सोलर रूफटॉप सब्सिडी के तहत ग्रामीण कोल्ड स्टोरेज और वेयरहाउस के लिए नए नियम क्या हैं?',
        language: 'hi',
        category: 'Renewable Energy & Subsidy',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        fallbackSourceType: 'web',
        status: 'pending',
        suggestedAction: 'Add MNRE PM-KUSUM Component-C & Solar Subsidy Guidelines to Knowledge Base.',
        webSourcesFound: [
          { title: 'Ministry of New and Renewable Energy (MNRE)', officialUrl: 'https://mnre.gov.in' }
        ]
      },
      {
        id: 'notif-seed-3',
        query: 'FSSAI food license renewal procedure and penalty for cooperative organic grain stores',
        language: 'en',
        category: 'Compliance & Licensing',
        timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
        fallbackSourceType: 'web',
        status: 'reviewed',
        suggestedAction: 'Review FSSAI State Cooperative Food Safety Exemption gazette.',
        webSourcesFound: [
          { title: 'Food Safety and Standards Authority of India (FSSAI)', officialUrl: 'https://fssai.gov.in' }
        ]
      }
    ];

    this.totalQueriesCount = 28;
    this.ragHitsCount = 21;
    this.webFallbacksCount = 7;
  }

  public recordQueryEvent(params: {
    query: string;
    language: string;
    category?: string;
    isRagHit: boolean;
    webSources?: Array<{ title: string; officialUrl: string }>;
  }) {
    this.totalQueriesCount++;

    if (params.isRagHit) {
      this.ragHitsCount++;
    } else {
      this.webFallbacksCount++;

      // Create a Missing RAG Query Notification for Admin
      const newNotification: MissingRagQueryNotification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        query: params.query,
        language: params.language || 'en',
        category: params.category || this.inferCategory(params.query),
        timestamp: new Date().toISOString(),
        fallbackSourceType: 'web',
        status: 'pending',
        suggestedAction: `Upload official government gazette or circular regarding "${params.query.slice(0, 40)}..." to Google Drive RAG repository.`,
        webSourcesFound: params.webSources || []
      };

      // Prepend to top of list
      this.notifications.unshift(newNotification);

      // Keep last 150 notifications
      if (this.notifications.length > 150) {
        this.notifications.pop();
      }
    }
  }

  private inferCategory(query: string): string {
    const q = query.toLowerCase();
    if (q.includes('vehicle') || q.includes('tractor') || q.includes('transport') || q.includes('rc') || q.includes('driving')) return 'Transport & Motor Vehicle';
    if (q.includes('tax') || q.includes('gst') || q.includes('tds') || q.includes('pan')) return 'Taxation & Finance';
    if (q.includes('solar') || q.includes('kusum') || q.includes('energy') || q.includes('electricity')) return 'Energy & Infrastructure';
    if (q.includes('fssai') || q.includes('license') || q.includes('food') || q.includes('fpo')) return 'Compliance & Licensing';
    if (q.includes('dairy') || q.includes('milk') || q.includes('cattle')) return 'Dairy & Animal Husbandry';
    if (q.includes('fertilizer') || q.includes('seed') || q.includes('pesticide')) return 'Agritech & Inputs';
    return 'General Statutory Policy';
  }

  public getNotifications(): MissingRagQueryNotification[] {
    return this.notifications;
  }

  public updateNotificationStatus(id: string, status: 'pending' | 'reviewed' | 'resolved'): boolean {
    const item = this.notifications.find(n => n.id === id);
    if (item) {
      item.status = status;
      return true;
    }
    return false;
  }

  public clearAllNotifications(): void {
    this.notifications = [];
  }

  public getStats() {
    const pendingCount = this.notifications.filter(n => n.status === 'pending').length;
    return {
      totalUserQueries: this.totalQueriesCount,
      ragHits: this.ragHitsCount,
      webFallbacks: this.webFallbacksCount,
      unresolvedMissingQueries: pendingCount,
      ragAccuracyRate: this.totalQueriesCount > 0 ? Math.round((this.ragHitsCount / this.totalQueriesCount) * 100) : 100
    };
  }

  public getKnowledgeGapsBreakdown() {
    const catMap: Record<string, { count: number; examples: string[] }> = {};
    for (const notif of this.notifications) {
      const cat = notif.category || 'General';
      if (!catMap[cat]) {
        catMap[cat] = { count: 0, examples: [] };
      }
      catMap[cat].count++;
      if (catMap[cat].examples.length < 3) {
        catMap[cat].examples.push(notif.query);
      }
    }

    return Object.entries(catMap)
      .map(([category, data]) => ({
        category,
        count: data.count,
        examples: data.examples
      }))
      .sort((a, b) => b.count - a.count);
  }
}

export const adminTelemetryStore = new AdminTelemetryStore();
