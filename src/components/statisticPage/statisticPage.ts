import BaseComponent from '../baseComponent/baseComponent';

class StatisticPage extends BaseComponent {
  inner = '<h2 class="main__title">Статистика</h2>';

  constructor() {
    super('main', 'main', 'statistic');
  }
}

export default StatisticPage;
