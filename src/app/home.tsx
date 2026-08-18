import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Nav from '../components/nav';

export default function Home() {
  return (
    <View style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Luxor University</Text>

        <View style={styles.divider} />

        <Text style={styles.paragraph}>
          يسعدني أن أرحب بكم في رحاب جامعة الأقصر، الصرح العلمي المتميز الذي يمثل منارة
          للعلم والمعرفة في جنوب صعيد مصر، بمدينة تحتضن ثلث آثار العالم. نفخر بجامعتنا التي
          تجمع بين أصالة التاريخ وعراقة الحضارة وطموح المستقبل، ونسعى جاهدين لتحقيق الريادة
          في التعليم العالي والبحث العلمي، وإعداد خريجين مؤهلين قادرين على المنافسة في
          أسواق العمل المحلية والإقليمية والدولية. نؤمن بأن بناء الإنسان هو أساس نهضة الأمم، لذا
          نعمل على تنمية مهارات طلابنا وقدراتهم العلمية والعملية والقيادية، ليكونوا قادة المستقبل
          وقاطرة التنمية في وطننا الحبيب مصر. مرحباً بكم في جامعة الأقصر.. حيث يلتقي مجد
          الأجداد بطموج الأحفاد.
        </Text>

        <Image source={require('../../assets/logo.png')} style={styles.bottomImage} />
      </ScrollView>

      <Nav activeTab="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 58,
    paddingBottom: 132,
  },
  logo: {
    width: 116,
    height: 116,
    resizeMode: 'contain',
    marginBottom: 14,
  },
  title: {
    color: '#0f2b6d',
    fontSize: 29,
    fontWeight: '800',
    textAlign: 'center',
  },
  divider: {
    width: '82%',
    height: 1,
    backgroundColor: '#d9e1ef',
    marginVertical: 22,
  },
  paragraph: {
    width: '100%',
    color: '#102a62',
    fontSize: 17,
    lineHeight: 31,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  bottomImage: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginTop: 24,
  },
});
