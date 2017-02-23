export default function(){
  this.transition(
    this.hasClass('fadeScreens'),
    this.use('fade')
  );

  this.transition(
    this.hasClass('nextPage'),
    this.use('fade', {duration: 250})
  );
}
