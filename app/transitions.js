export default function(){
  this.transition(
    this.hasClass('fadeScreens'),
    this.use('fade')
  );

  this.transition(
    this.hasClass('nextPage'),
    this.toValue(true),
    this.use('toRight'),
    this.reverse('toLeft')
  );
};
