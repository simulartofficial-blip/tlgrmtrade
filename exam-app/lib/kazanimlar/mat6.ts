import { Kazanim } from '@/types'

export const mat6Kazanimlar: Kazanim[] = [
  { id: '1', code: 'M.6.1.1.1', grade: 6, subject: 'Matematik', topic: 'Doğal Sayılar', description: 'Doğal sayıları okur, yazar ve karşılaştırır.' },
  { id: '2', code: 'M.6.1.1.2', grade: 6, subject: 'Matematik', topic: 'Doğal Sayılar', description: 'Büyük doğal sayıları yazar, okur ve karşılaştırır.' },
  { id: '3', code: 'M.6.1.1.3', grade: 6, subject: 'Matematik', topic: 'Doğal Sayılar', description: 'Doğal sayılarla dört işlem yapar ve problemler çözer.' },
  { id: '4', code: 'M.6.1.4.1', grade: 6, subject: 'Matematik', topic: 'Kesirler', description: 'Kesirleri karşılaştırır, sıralar ve eşdeğer kesirleri belirler.' },
  { id: '5', code: 'M.6.1.4.2', grade: 6, subject: 'Matematik', topic: 'Kesirler', description: 'Kesirleri sayı doğrusunda gösterir.' },
  { id: '6', code: 'M.6.1.4.3', grade: 6, subject: 'Matematik', topic: 'Kesirler', description: 'Kesirlerle toplama ve çıkarma işlemi yapar.' },
  { id: '7', code: 'M.6.1.4.4', grade: 6, subject: 'Matematik', topic: 'Kesirler', description: 'Kesirlerle çarpma işlemi yapar ve problemler çözer.' },
  { id: '8', code: 'M.6.1.4.5', grade: 6, subject: 'Matematik', topic: 'Kesirler', description: 'Bir doğal sayının basit kesir kadarını hesaplar.' },
  { id: '9', code: 'M.6.1.5.1', grade: 6, subject: 'Matematik', topic: 'Ondalık Gösterim', description: 'Ondalık gösterimi okur, yazar ve karşılaştırır.' },
  { id: '10', code: 'M.6.1.5.2', grade: 6, subject: 'Matematik', topic: 'Ondalık Gösterim', description: 'Ondalık gösterimlerle toplama ve çıkarma işlemi yapar.' },
  { id: '11', code: 'M.6.1.5.3', grade: 6, subject: 'Matematik', topic: 'Ondalık Gösterim', description: 'Ondalık gösterimlerle çarpma ve bölme işlemi yapar.' },
  { id: '12', code: 'M.6.1.6.1', grade: 6, subject: 'Matematik', topic: 'Yüzdeler', description: 'Yüzde kavramını anlar ve yüzde hesaplamalarını yapar.' },
  { id: '13', code: 'M.6.1.6.2', grade: 6, subject: 'Matematik', topic: 'Yüzdeler', description: 'Yüzde problemlerini çözer.' },
  { id: '14', code: 'M.6.1.2.1', grade: 6, subject: 'Matematik', topic: 'Tam Sayılar', description: 'Tam sayıları tanır, sayı doğrusunda gösterir ve karşılaştırır.' },
  { id: '15', code: 'M.6.1.2.2', grade: 6, subject: 'Matematik', topic: 'Tam Sayılar', description: 'Tam sayılarla toplama ve çıkarma işlemi yapar.' },
  { id: '16', code: 'M.6.2.1.1', grade: 6, subject: 'Matematik', topic: 'Oran ve Orantı', description: 'İki nicelik arasındaki oranı belirler ve ifade eder.' },
  { id: '17', code: 'M.6.2.1.2', grade: 6, subject: 'Matematik', topic: 'Oran ve Orantı', description: 'Doğru orantılı iki niceliği tanır ve problem çözer.' },
  { id: '18', code: 'M.6.3.1.1', grade: 6, subject: 'Matematik', topic: 'Cebir', description: 'Bir niceliği harf ile gösterir ve basit denklemler kurar.' },
  { id: '19', code: 'M.6.3.1.2', grade: 6, subject: 'Matematik', topic: 'Cebir', description: 'Birinci dereceden denklemleri çözer.' },
  { id: '20', code: 'M.6.4.1.1', grade: 6, subject: 'Matematik', topic: 'Geometri', description: 'Çokgenlerin özelliklerini tanır ve sınıflandırır.' },
  { id: '21', code: 'M.6.4.1.2', grade: 6, subject: 'Matematik', topic: 'Geometri', description: 'Dikdörtgen ve karenin alanını hesaplar.' },
  { id: '22', code: 'M.6.4.1.3', grade: 6, subject: 'Matematik', topic: 'Geometri', description: 'Üçgenin alanını hesaplar ve problemler çözer.' },
  { id: '23', code: 'M.6.4.2.1', grade: 6, subject: 'Matematik', topic: 'Geometri', description: 'Çember ve dairenin temel elemanlarını tanır.' },
  { id: '24', code: 'M.6.5.1.1', grade: 6, subject: 'Matematik', topic: 'Veri İşleme', description: 'Verileri tablo ve grafiklere dönüştürür, yorumlar.' },
  { id: '25', code: 'M.6.5.1.2', grade: 6, subject: 'Matematik', topic: 'Veri İşleme', description: 'Ortalama, mod ve medyanı hesaplar.' },
]

export const getTopics = () => [...new Set(mat6Kazanimlar.map(k => k.topic))]
export const getKazanimsByTopic = (topic: string) => mat6Kazanimlar.filter(k => k.topic === topic)
